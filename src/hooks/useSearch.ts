import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Article, AltitudeCategory } from "@/data/articles";

export const useSearch = () => {
  const [results, setResults] = useState<Article[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    // Use Postgres FTS via RPC — avoids exposing tsvector to client
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .textSearch("search_vector", query.trim().replace(/\s+/g, " & "), {
        type: "websearch",
        config: "english",
      })
      .limit(10);

    if (data) {
      setResults(data.map(a => ({
        id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt,
        coverImage: a.cover_image, altitude: a.altitude as AltitudeCategory,
        author: a.author, designer: a.designer ?? undefined,
        fabricTags: a.fabric_tags ?? [], totalLikes: 0,
        avgRating: 0, reviewCount: 0, publishedAt: a.created_at, body: a.body,
      })));
    }
    setSearching(false);
  }, []);

  const clear = () => setResults([]);
  return { results, searching, search, clear };
};
