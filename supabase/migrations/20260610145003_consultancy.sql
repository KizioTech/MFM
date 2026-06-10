-- migration: 003_consultancy.sql
CREATE TABLE public.services (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  provider     text NOT NULL,
  category     text NOT NULL DEFAULT 'styling'
    CHECK (category IN ('styling','photography','design','other')),
  rate_display text NOT NULL DEFAULT '',   -- e.g. 'MK 15,000 / hour'
  image_url    text NOT NULL DEFAULT '',
  available    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.service_bookings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id   uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  email        text NOT NULL,
  message      text NOT NULL,
  preferred_date date,
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable"
  ON public.services FOR SELECT USING (available = true);

CREATE POLICY "Admins manage services"
  ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit a service booking"
  ON public.service_bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all service bookings"
  ON public.service_bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
