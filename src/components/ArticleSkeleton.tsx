import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface ArticleSkeletonProps {
  featured?: boolean;
}

const ArticleSkeleton = ({ featured = false }: ArticleSkeletonProps) => {
  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-sm w-full h-[60vh] md:h-[75vh] bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary/20 animate-spin z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-4">
          <Skeleton className="h-6 w-24 bg-primary/20" />
          <Skeleton className="h-12 md:h-16 w-3/4 bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-2/3 bg-white/10" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-sm aspect-[4/5] flex items-center justify-center">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <Loader2 className="w-5 h-5 text-primary/20 animate-spin z-10" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-6 w-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
