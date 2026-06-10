import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import { BadgeCheck } from "lucide-react";
import type { Designer } from "@/hooks/useDesigners";

const DesignerCard = ({ designer }: { designer: Designer }) => (
  <Link to={`/designers/${designer.slug}`} className="group block">
    <div className="relative overflow-hidden rounded-sm aspect-[4/3]">
      <LazyImage
        src={designer.cover_image}
        alt={designer.name}
        aspectRatio="landscape"
        className="transition-transform duration-700 group-hover:scale-105"
      />
      {designer.verified && (
        <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-primary/90 text-primary-foreground text-[10px] font-sans font-medium rounded-sm">
          <BadgeCheck className="w-3 h-3" /> Verified
        </span>
      )}
    </div>
    <div className="mt-3 flex items-center gap-3">
      <img
        src={designer.avatar_url}
        alt={designer.name}
        className="w-10 h-10 rounded-full object-cover border border-border"
      />
      <div>
        <h3 className="text-editorial-heading text-lg group-hover:text-primary transition-colors">
          {designer.name}
        </h3>
        <p className="font-sans text-xs text-muted-foreground">{designer.location}</p>
      </div>
    </div>
    <div className="flex gap-1.5 mt-2 flex-wrap">
      {designer.categories.slice(0, 3).map(cat => (
        <span key={cat} className="text-[10px] font-sans px-2 py-0.5 bg-muted text-muted-foreground rounded-sm capitalize">
          {cat}
        </span>
      ))}
    </div>
  </Link>
);

export default DesignerCard;
