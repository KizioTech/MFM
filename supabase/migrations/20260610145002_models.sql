-- migration: 002_models.sql
CREATE TABLE public.model_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            text NOT NULL UNIQUE,
  display_name    text NOT NULL,
  bio             text NOT NULL DEFAULT '',
  avatar_url      text NOT NULL DEFAULT '',
  cover_image     text NOT NULL DEFAULT '',
  height_cm       integer,
  experience_tags text[] NOT NULL DEFAULT '{}',  -- {'runway','editorial','commercial'}
  location        text NOT NULL DEFAULT 'Malawi',
  available       boolean NOT NULL DEFAULT true,
  portfolio_urls  text[] NOT NULL DEFAULT '{}',  -- Supabase storage public URLs
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.model_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.model_booking_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id     uuid NOT NULL REFERENCES public.model_profiles(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  email        text NOT NULL,
  message      text NOT NULL,
  project_type text NOT NULL DEFAULT '',
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','declined')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.model_booking_requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.model_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Anyone can browse model profiles
CREATE POLICY "Model profiles are publicly readable"
  ON public.model_profiles FOR SELECT USING (true);

-- Models manage their own profile
CREATE POLICY "Users manage own model profile"
  ON public.model_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage any profile
CREATE POLICY "Admins manage all model profiles"
  ON public.model_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Models can see requests for their own profile
CREATE POLICY "Models view their own booking requests"
  ON public.model_booking_requests FOR SELECT TO authenticated
  USING (
    model_id IN (
      SELECT id FROM public.model_profiles WHERE user_id = auth.uid()
    )
  );

-- Anyone (incl. anon) can submit a booking request
CREATE POLICY "Anyone can submit a booking request"
  ON public.model_booking_requests FOR INSERT
  WITH CHECK (true);

-- Admins can see all
CREATE POLICY "Admins view all booking requests"
  ON public.model_booking_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- New bucket for model portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('model_portfolio', 'model_portfolio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Model portfolio images publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'model_portfolio');

CREATE POLICY "Authenticated users upload to model_portfolio"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'model_portfolio');
