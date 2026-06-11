import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "portrait" | "landscape" | "video" | "square" | "auto";
  width?: number; // used for Supabase CDN optimization
}

/**
 * Optimises Supabase Storage URLs by appending transform params.
 * Use width=400 for thumbnails, 800 for article heroes, 1200 for full-bleed covers.
 */
function optimisedUrl(url: string, width?: number): string {
  if (!url || !url.includes("supabase") || !width) return url;
  return `${url}?width=${width}&quality=80&format=webp`;
}

const LazyImage = ({ src, alt, className, aspectRatio = "auto", width, ...props }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const finalSrc = optimisedUrl(src, width);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    const img = new Image();
    img.src = finalSrc;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [finalSrc]);

  const aspectClasses = {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/9]",
    video: "aspect-video",
    square: "aspect-square",
    auto: "",
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectClasses[aspectRatio], className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="absolute inset-0 w-full h-full animate-pulse" />
          <Loader2 className="w-6 h-6 text-primary/30 animate-spin z-10" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs p-4 text-center italic">
          Image unavailable
        </div>
      ) : (
        <img
          src={finalSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover object-center",
            "transition-all duration-700 ease-out",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]",
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
