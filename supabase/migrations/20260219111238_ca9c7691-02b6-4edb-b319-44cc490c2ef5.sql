-- Allow admins to update any profile (for status toggle, role changes via service_role bypass)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (user_has_role('admin'::user_role))
WITH CHECK (user_has_role('admin'::user_role));

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());