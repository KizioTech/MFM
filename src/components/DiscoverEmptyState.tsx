import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface DiscoverEmptyStateProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Number of placeholder cards to show */
  placeholderCount?: number;
}

/**
 * An aesthetic empty state for Discover pages.
 * Shows a message over a grid of blurred placeholder cards to
 * give the page visual weight even when the database is empty.
 */
const DiscoverEmptyState = ({
  title,
  subtitle,
  ctaLabel = "Stay tuned",
  ctaHref,
  placeholderCount = 6,
}: DiscoverEmptyStateProps) => {
  // Muted placeholder colours that evoke fashion photography
  const placeholderColors = [
    "from-stone-300 to-stone-400",
    "from-amber-200 to-amber-300",
    "from-rose-200 to-rose-300",
    "from-zinc-300 to-zinc-400",
    "from-orange-200 to-orange-300",
    "from-neutral-300 to-neutral-400",
    "from-stone-200 to-stone-300",
    "from-amber-300 to-amber-400",
  ];

  return (
    <div className="relative">
      {/* Blurred placeholder grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 opacity-30 blur-[2px] select-none pointer-events-none" aria-hidden="true">
        {[...Array(placeholderCount)].map((_, i) => (
          <div key={i} className="rounded-sm overflow-hidden">
            <div className={`aspect-[3/4] bg-gradient-to-br ${placeholderColors[i % placeholderColors.length]}`} />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded-sm" />
              <div className="h-3 w-1/2 bg-muted rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-md px-6 py-10 bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-editorial-heading text-2xl md:text-3xl text-foreground mb-2">
            {title}
          </h2>
          <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
            {subtitle}
          </p>
          {ctaHref ? (
            <Link
              to={ctaHref}
              className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              {ctaLabel}
            </Link>
          ) : (
            <span className="inline-block px-6 py-2.5 bg-muted text-muted-foreground font-sans text-sm font-medium rounded-sm cursor-default">
              {ctaLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverEmptyState;
