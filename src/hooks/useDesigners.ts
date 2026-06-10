import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Designer {
  id: string;
  slug: string;
  name: string;
  bio: string;
  location: string;
  cover_image: string;
  avatar_url: string;
  categories: string[];
  social_ig: string | null;
  social_web: string | null;
  verified: boolean;
}

// Module-level cache — persists across component mounts in same session
let cache: Designer[] | null = null;

export const useDesigners = () => {
  const [designers, setDesigners] = useState<Designer[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    supabase
      .from("designers")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) {
          cache = data as Designer[];
          setDesigners(cache);
        }
        setLoading(false);
      });
  }, []);

  return { designers, loading };
};
