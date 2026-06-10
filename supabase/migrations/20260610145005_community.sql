-- migration: 005_community.sql
CREATE TABLE public.community_posts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url    text NOT NULL,
  caption      text NOT NULL DEFAULT '',
  fabric_tags  text[] NOT NULL DEFAULT '{}',
  designer_id  uuid REFERENCES public.designers(id) ON DELETE SET NULL,
  approved     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.community_likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Only approved posts visible publicly
CREATE POLICY "Approved community posts are publicly readable"
  ON public.community_posts FOR SELECT
  USING (approved = true);

-- Users can see their own unapproved posts
CREATE POLICY "Users see their own posts"
  ON public.community_posts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can submit
CREATE POLICY "Authenticated users can submit posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins approve/delete
CREATE POLICY "Admins manage community posts"
  ON public.community_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Like counts are public"
  ON public.community_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.community_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.community_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- New bucket for community style posts
INSERT INTO storage.buckets (id, name, public)
VALUES ('community_posts', 'community_posts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Community images publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community_posts');

CREATE POLICY "Authenticated users upload community images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community_posts' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
