
-- Add physical archive location fields to documents table
ALTER TABLE public.documents
ADD COLUMN archive_zone text,
ADD COLUMN archive_room text,
ADD COLUMN archive_cabinet text,
ADD COLUMN archive_shelf text,
ADD COLUMN archive_box text,
ADD COLUMN archive_folder text,
ADD COLUMN archive_code text UNIQUE;

-- Create a sequence for archive numbering
CREATE SEQUENCE IF NOT EXISTS archive_code_seq START 1;

-- Function to generate archive code: ARC-[DEPARTEMENT]-[ANNEE]-[NUMERO]
CREATE OR REPLACE FUNCTION public.generate_archive_code(dept text, yr text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  seq_num integer;
  code text;
BEGIN
  seq_num := nextval('archive_code_seq');
  code := 'ARC-' || COALESCE(UPPER(REPLACE(dept, ' ', '')), 'GENERAL') || '-' || COALESCE(yr, EXTRACT(YEAR FROM now())::text) || '-' || LPAD(seq_num::text, 5, '0');
  RETURN code;
END;
$$;
