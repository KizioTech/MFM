import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import type { ModelProfile } from "@/hooks/useModels";

const ModelCard = ({ model }: { model: ModelProfile }) => (
  <Link to={`/models/${model.slug}`} className="group block">
    <div className="relative overflow-hidden rounded-sm aspect-[3/4]">
      <LazyImage
        src={model.avatar_url}
        alt={model.display_name}
        aspectRatio="portrait"
        className="transition-transform duration-700 group-hover:scale-105"
      />
      {model.available && (
        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-sans rounded-sm">
          Available
        </span>
      )}
    </div>
    <div className="mt-2">
      <h3 className="text-editorial-heading text-base group-hover:text-primary transition-colors">
        {model.display_name}
      </h3>
      <p className="font-sans text-xs text-muted-foreground">{model.location}</p>
      <div className="flex gap-1 mt-1 flex-wrap">
        {model.experience_tags.slice(0, 2).map(t => (
          <span key={t} className="text-[10px] font-sans px-2 py-0.5 bg-muted text-muted-foreground rounded-sm capitalize">
            {t}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default ModelCard;
