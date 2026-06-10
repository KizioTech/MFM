-- migration: 006_comments.sql
CREATE TABLE public.article_comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         text NOT NULL CHECK (char_length(body) >= 3 AND char_length(body) <= 1000),
  approved     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Only approved comments are publicly visible
CREATE POLICY "Approved comments are publicly readable"
  ON public.article_comments FOR SELECT
  USING (approved = true);

-- Users can see their own unapproved comments
CREATE POLICY "Users see own comments"
  ON public.article_comments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can post
CREATE POLICY "Authenticated users can comment"
  ON public.article_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins manage all
CREATE POLICY "Admins manage comments"
  ON public.article_comments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
