-- Trigger type regeneration
-- This creates a simple function that will trigger the Lovable Cloud type generation
CREATE OR REPLACE FUNCTION public.trigger_type_generation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function exists solely to trigger type regeneration
  RETURN;
END;
$$;