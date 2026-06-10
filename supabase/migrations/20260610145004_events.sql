-- migration: 004_events.sql
CREATE TABLE public.events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  location     text NOT NULL DEFAULT '',
  cover_image  text NOT NULL DEFAULT '',
  starts_at    timestamptz NOT NULL,
  ends_at      timestamptz,
  ticket_url   text,
  free         boolean NOT NULL DEFAULT false,
  published    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.event_rsvps (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are publicly readable"
  ON public.events FOR SELECT USING (published = true);

CREATE POLICY "Admins manage events"
  ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can RSVP"
  ON public.event_rsvps FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their RSVP"
  ON public.event_rsvps FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "RSVP counts are public"
  ON public.event_rsvps FOR SELECT USING (true);
