import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LazyImage from "@/components/LazyImage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { MFMEvent } from "@/hooks/useEvents";
import useSEO from "@/hooks/useSEO";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<MFMEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [rsvped, setRsvped] = useState(false);

  useSEO({
    title: event ? `${event.title} — Events — MFM` : "Event",
    description: event?.description ?? "",
    image: event?.cover_image,
  });

  useEffect(() => {
    if (!slug) return;
    const run = async () => {
      const { data: ev } = await supabase
        .from("events").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (!ev) { setLoading(false); return; }
      setEvent(ev as MFMEvent);

      const { count } = await supabase
        .from("event_rsvps").select("*", { count: "exact", head: true }).eq("event_id", ev.id);
      setRsvpCount(count ?? 0);

      if (user) {
        const { data } = await supabase
          .from("event_rsvps").select("id")
          .eq("event_id", ev.id).eq("user_id", user.id).maybeSingle();
        setRsvped(!!data);
      }
      setLoading(false);
    };
    run();
  }, [slug, user]);

  const toggleRSVP = async () => {
    if (!user) { toast.info("Sign in to RSVP"); return; }
    if (!event) return;
    if (rsvped) {
      await supabase.from("event_rsvps").delete()
        .eq("event_id", event.id).eq("user_id", user.id);
      setRsvped(false);
      setRsvpCount(c => c - 1);
    } else {
      await supabase.from("event_rsvps").insert({ event_id: event.id, user_id: user.id });
      setRsvped(true);
      setRsvpCount(c => c + 1);
    }
  };

  if (loading || !event) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative h-[40vh] md:h-[55vh]">
        <LazyImage src={event.cover_image} alt={event.title} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12">
          <h1 className="text-editorial-heading text-3xl md:text-5xl text-primary-foreground mb-3">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-primary-foreground/70 text-sm font-sans">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {fmt(event.starts_at)}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={toggleRSVP}
            className={`px-5 py-2.5 font-sans text-sm font-medium rounded-sm transition-colors ${
              rsvped
                ? "bg-muted text-foreground border border-border hover:border-destructive hover:text-destructive"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}>
            {rsvped ? `Going (${rsvpCount})` : `RSVP — ${rsvpCount} attending`}
          </button>
          {event.ticket_url && (
            <a href={event.ticket_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-border font-sans text-sm rounded-sm hover:border-primary transition-colors">
              <ExternalLink className="w-4 h-4" /> Get Tickets
            </a>
          )}
        </div>

        <p className="font-sans text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>

        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors mt-12">
          <ArrowLeft className="w-4 h-4" /> All Events
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetailPage;
