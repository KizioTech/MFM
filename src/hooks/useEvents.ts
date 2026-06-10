import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MFMEvent {
  id: string; slug: string; title: string; description: string;
  location: string; cover_image: string; starts_at: string;
  ends_at: string | null; ticket_url: string | null; free: boolean;
}

export const useEvents = () => {
  const [events, setEvents] = useState<MFMEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .gte("starts_at", new Date().toISOString())  // only upcoming
      .order("starts_at")
      .then(({ data }) => {
        if (data) setEvents(data as MFMEvent[]);
        setLoading(false);
      });
  }, []);

  return { events, loading };
};
