
-- Créer une table pour les départements
CREATE TABLE public.departments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Activer RLS sur la table departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux administrateurs de voir tous les départements
CREATE POLICY "Admins can view all departments" 
  ON public.departments 
  FOR SELECT 
  USING (user_has_role('admin'));

-- Politique pour permettre aux administrateurs de créer des départements
CREATE POLICY "Admins can create departments" 
  ON public.departments 
  FOR INSERT 
  WITH CHECK (user_has_role('admin'));

-- Politique pour permettre aux administrateurs de modifier des départements
CREATE POLICY "Admins can update departments" 
  ON public.departments 
  FOR UPDATE 
  USING (user_has_role('admin'));

-- Politique pour permettre aux administrateurs de supprimer des départements
CREATE POLICY "Admins can delete departments" 
  ON public.departments 
  FOR DELETE 
  USING (user_has_role('admin'));

-- Insérer quelques départements par défaut
INSERT INTO public.departments (name, description) VALUES
  ('Direction', 'Direction générale'),
  ('Ressources Humaines', 'Gestion des ressources humaines'),
  ('Informatique', 'Services informatiques'),
  ('Comptabilité', 'Services comptables et financiers'),
  ('Archives', 'Gestion des archives'),
  ('Secrétariat', 'Services de secrétariat');
