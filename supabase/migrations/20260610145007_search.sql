-- migration: 007_search.sql
-- Add a generated tsvector column to articles for fast FTS
ALTER TABLE public.articles
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
      setweight(to_tsvector('english', coalesce(excerpt,'')), 'B') ||
      setweight(to_tsvector('english', coalesce(body,'')), 'C')
    ) STORED;

CREATE INDEX articles_search_idx ON public.articles USING GIN (search_vector);
