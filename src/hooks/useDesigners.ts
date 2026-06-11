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

const CACHE_KEY = "mfm_designers_cache";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFromLocalStorage(): Designer[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data as Designer[];
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: Designer[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // LocalStorage may be full or unavailable — silently ignore
  }
}

export const useDesigners = () => {
  const cached = getFromLocalStorage();
  const [designers, setDesigners] = useState<Designer[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    supabase
      .from("designers")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) {
          saveToLocalStorage(data as Designer[]);
          setDesigners(data as Designer[]);
        }
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { designers, loading };
};
