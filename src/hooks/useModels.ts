import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ModelProfile {
  id: string;
  slug: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  cover_image: string;
  height_cm: number | null;
  experience_tags: string[];
  location: string;
  available: boolean;
  portfolio_urls: string[];
}

export const useModels = () => {
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("model_profiles")
      .select("*")
      .eq("available", true)
      .order("display_name")
      .then(({ data }) => {
        if (data) setModels(data as ModelProfile[]);
        setLoading(false);
      });
  }, []);

  return { models, loading };
};
