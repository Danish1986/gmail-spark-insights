-- Make phone column nullable to support Google OAuth sign-in
ALTER TABLE public.profiles 
ALTER COLUMN phone DROP NOT NULL;