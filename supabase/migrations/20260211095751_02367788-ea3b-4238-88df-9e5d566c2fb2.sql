
-- 1. Créer l'enum pour les niveaux de confidentialité
CREATE TYPE public.confidentiality_level AS ENUM ('C0', 'C1', 'C2', 'C3');

-- 2. Ajouter la colonne au tableau documents
ALTER TABLE public.documents 
ADD COLUMN confidentiality_level public.confidentiality_level NOT NULL DEFAULT 'C1';

-- 3. Créer la table d'accès nominal
CREATE TABLE public.document_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT true,
  can_download BOOLEAN NOT NULL DEFAULT false,
  granted_by UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, user_id)
);

ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;

-- 4. Fonction de vérification d'accès par confidentialité
CREATE OR REPLACE FUNCTION public.can_access_by_confidentiality(doc_confidentiality confidentiality_level, doc_department text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile_role user_role;
  user_dept text;
  uid uuid;
BEGIN
  uid := auth.uid();
  SELECT role, department INTO user_profile_role, user_dept 
  FROM public.profiles WHERE id = uid;

  -- C0 Public: tout le monde
  IF doc_confidentiality = 'C0' THEN RETURN true; END IF;

  -- C1 Interne: même département ou admin/archiviste
  IF doc_confidentiality = 'C1' THEN
    IF user_profile_role IN ('admin', 'archiviste') THEN RETURN true; END IF;
    IF user_profile_role IN ('admin_local', 'utilisateur') AND user_dept = doc_department THEN RETURN true; END IF;
    RETURN false;
  END IF;

  -- C2 Confidentiel: admin et archiviste uniquement
  IF doc_confidentiality = 'C2' THEN
    RETURN user_profile_role IN ('admin', 'archiviste');
  END IF;

  -- C3 Très Confidentiel: admin uniquement
  IF doc_confidentiality = 'C3' THEN
    RETURN user_profile_role = 'admin';
  END IF;

  RETURN false;
END;
$$;

-- 5. Fonction pour vérifier l'accès nominal
CREATE OR REPLACE FUNCTION public.has_nominal_access(doc_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.document_access
    WHERE document_id = doc_id AND user_id = auth.uid() AND can_view = true
  );
END;
$$;

-- 6. Remplacer les policies SELECT sur documents
DROP POLICY IF EXISTS "Administrateurs et archivistes voient tous les documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view documents from their department" ON public.documents;
DROP POLICY IF EXISTS "Les utilisateurs ne voient que les documents actifs" ON public.documents;

CREATE POLICY "Document access by confidentiality and nominal"
ON public.documents FOR SELECT
USING (
  can_access_by_confidentiality(confidentiality_level, issuing_department)
  OR has_nominal_access(id)
);

-- 7. Policies pour document_access
CREATE POLICY "Admins can manage all access"
ON public.document_access FOR ALL
USING (user_has_role('admin'::user_role))
WITH CHECK (user_has_role('admin'::user_role));

CREATE POLICY "Archivistes can manage access"
ON public.document_access FOR ALL
USING (user_has_role('archiviste'::user_role))
WITH CHECK (user_has_role('archiviste'::user_role));

CREATE POLICY "Users can see their own access"
ON public.document_access FOR SELECT
USING (user_id = auth.uid());
