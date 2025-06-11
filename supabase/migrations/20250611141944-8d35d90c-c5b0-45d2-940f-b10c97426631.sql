
-- Mettre à jour l'enum user_role pour inclure admin_local
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_local';

-- Créer une fonction pour vérifier les permissions d'accès aux documents
CREATE OR REPLACE FUNCTION public.can_access_document(doc_department text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile_role user_role;
  user_department text;
BEGIN
  SELECT role, department INTO user_profile_role, user_department 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Admin peut tout voir
  IF user_profile_role = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Admin local et utilisateur ne peuvent voir que leur département
  IF user_profile_role IN ('admin_local', 'utilisateur') THEN
    RETURN doc_department = user_department;
  END IF;
  
  RETURN false;
END;
$$;

-- Créer une fonction pour vérifier si l'utilisateur peut modifier des documents
CREATE OR REPLACE FUNCTION public.can_modify_documents()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile_role user_role;
BEGIN
  SELECT role INTO user_profile_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN user_profile_role IN ('admin', 'admin_local');
END;
$$;

-- Activer RLS sur la table documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture des documents (basée sur le département)
CREATE POLICY "Users can view documents from their department" 
ON public.documents 
FOR SELECT 
USING (public.can_access_document(issuing_department));

-- Politique pour l'insertion des documents (seulement admin et admin_local)
CREATE POLICY "Admin and admin_local can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (public.can_modify_documents());

-- Politique pour la modification des documents (seulement admin et admin_local)
CREATE POLICY "Admin and admin_local can update documents" 
ON public.documents 
FOR UPDATE 
USING (public.can_modify_documents());

-- Politique pour la suppression des documents (seulement admin et admin_local)
CREATE POLICY "Admin and admin_local can delete documents" 
ON public.documents 
FOR DELETE 
USING (public.can_modify_documents());
