import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import type { MFMEvent } from "@/hooks/useEvents";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const EventCard = ({ event }: { event: MFMEvent }) => (
  <Link to={`/events/${event.slug}`} className="group block border border-border rounded-sm overflow-hidden hover:border-primary transition-colors">
    <div className="relative aspect-[16/9] overflow-hidden">
      <LazyImage src={event.cover_image} alt={event.title} aspectRatio="landscape"
        className="transition-transform duration-700 group-hover:scale-105" />
      <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-sans font-medium rounded-sm ${
        event.free
          ? "bg-green-600 text-white"
          : "bg-primary/90 text-primary-foreground"
      }`}>
        {event.free ? "Free" : "Ticketed"}
      </span>
    </div>
    <div className="p-4">
      <h3 className="text-editorial-heading text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {event.title}
      </h3>
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" /> {fmt(event.starts_at)}
        </span>
        <span className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" /> {event.location}
        </span>
      </div>
    </div>
  </Link>
);

export default EventCard;
