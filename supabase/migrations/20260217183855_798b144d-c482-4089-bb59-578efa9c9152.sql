
-- Update can_access_by_confidentiality to handle auditeur (full access like admin)
CREATE OR REPLACE FUNCTION public.can_access_by_confidentiality(doc_confidentiality confidentiality_level, doc_department text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_profile_role user_role;
  user_dept text;
  uid uuid;
BEGIN
  uid := auth.uid();
  SELECT role, department INTO user_profile_role, user_dept 
  FROM public.profiles WHERE id = uid;

  -- Super Admin et Auditeur : accès total
  IF user_profile_role IN ('admin', 'auditeur') THEN RETURN true; END IF;

  -- C0 Public: tout le monde
  IF doc_confidentiality = 'C0' THEN RETURN true; END IF;

  -- C1 Interne: même département ou archiviste
  IF doc_confidentiality = 'C1' THEN
    IF user_profile_role = 'archiviste' THEN RETURN true; END IF;
    IF user_profile_role IN ('admin_local', 'utilisateur') AND user_dept = doc_department THEN RETURN true; END IF;
    RETURN false;
  END IF;

  -- C2 Confidentiel: admin_local (même dept) et archiviste
  IF doc_confidentiality = 'C2' THEN
    IF user_profile_role = 'archiviste' THEN RETURN true; END IF;
    IF user_profile_role = 'admin_local' AND user_dept = doc_department THEN RETURN true; END IF;
    RETURN false;
  END IF;

  -- C3 Très Confidentiel: admin uniquement (déjà géré au-dessus)
  IF doc_confidentiality = 'C3' THEN
    RETURN false;
  END IF;

  RETURN false;
END;
$function$;

-- Update can_access_document to handle auditeur
CREATE OR REPLACE FUNCTION public.can_access_document(doc_department text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_profile_role user_role;
  user_department text;
BEGIN
  SELECT role, department INTO user_profile_role, user_department 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Super Admin et Auditeur peuvent tout voir
  IF user_profile_role IN ('admin', 'auditeur') THEN
    RETURN true;
  END IF;
  
  -- Admin local et utilisateur ne peuvent voir que leur département
  IF user_profile_role IN ('admin_local', 'utilisateur') THEN
    RETURN doc_department = user_department;
  END IF;
  
  RETURN false;
END;
$function$;

-- Update can_modify_documents with search_path
CREATE OR REPLACE FUNCTION public.can_modify_documents()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_profile_role user_role;
BEGIN
  SELECT role INTO user_profile_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN user_profile_role IN ('admin', 'admin_local');
END;
$function$;

-- Update user_has_role with search_path
CREATE OR REPLACE FUNCTION public.user_has_role(required_role user_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_profile_role user_role;
BEGIN
  SELECT role INTO user_profile_role FROM public.profiles WHERE id = auth.uid();
  IF user_profile_role = 'admin' THEN RETURN true; END IF;
  RETURN user_profile_role = required_role;
END;
$function$;

-- Update has_nominal_access with search_path (already had it but ensuring consistency)
CREATE OR REPLACE FUNCTION public.has_nominal_access(doc_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.document_access
    WHERE document_id = doc_id AND user_id = auth.uid() AND can_view = true
  );
END;
$function$;

-- Update log_document_action with search_path
CREATE OR REPLACE FUNCTION public.log_document_action()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  action_type TEXT;
  details JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'upload';
    details := jsonb_build_object('document_id', NEW.id, 'title', NEW.title);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
    details := jsonb_build_object('document_id', NEW.id, 'title', NEW.title, 'changes', jsonb_build_object('before', row_to_json(OLD), 'after', row_to_json(NEW)));
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
    details := jsonb_build_object('document_id', OLD.id, 'title', OLD.title);
  END IF;

  INSERT INTO public.user_actions(user_id, action_type, document_id, details)
  VALUES (auth.uid(), action_type, COALESCE(NEW.id, OLD.id), details);

  RETURN NULL;
END;
$function$;

-- Add SELECT policy for auditeur on departments
CREATE POLICY "Auditeurs can view all departments"
  ON public.departments
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'auditeur'
  );
