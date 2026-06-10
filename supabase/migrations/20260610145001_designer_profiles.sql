-- migration: 001_designer_profiles.sql
CREATE TABLE public.designers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  bio         text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT 'Malawi',
  cover_image text NOT NULL DEFAULT '',
  avatar_url  text NOT NULL DEFAULT '',
  categories  text[] NOT NULL DEFAULT '{}',   -- e.g. {'couture','streetwear'}
  social_ig   text,
  social_web  text,
  verified    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_designers_updated_at
  BEFORE UPDATE ON public.designers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add designer_id FK to articles so articles link to a real profile
ALTER TABLE public.articles
  ADD COLUMN designer_id uuid REFERENCES public.designers(id) ON DELETE SET NULL;

-- Public read of all designers
CREATE POLICY "Designers are publicly readable"
  ON public.designers FOR SELECT USING (true);

-- Only admins can create/update/delete
CREATE POLICY "Admins manage designers"
  ON public.designers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
