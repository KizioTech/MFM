import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/components/LazyImage";
import type { Article } from "@/data/articles";
import { altitudeLabels } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      // Get total like count for this article
      const { count } = await supabase
        .from("article_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_slug", article.slug);
      
      if (count !== null) setLikeCount(count);

      // Check if current user liked it
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("article_likes")
          .select("id")
          .eq("article_slug", article.slug)
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (data) setLiked(true);
      }
    };
    fetchLikes();
  }, [article.slug]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.info("Please login to like articles");
      navigate("/auth");
      return;
    }

    // Optimistic update
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));

    if (liked) {
      // Unlike
      await supabase
        .from("article_likes")
        .delete()
        .eq("article_slug", article.slug)
        .eq("user_id", session.user.id);
    } else {
      // Like
      await supabase
        .from("article_likes")
        .insert({
          article_slug: article.slug,
          user_id: session.user.id,
        });
    }
  };

  if (featured) {
    return (
      <Link to={`/article/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-sm h-[60vh] md:h-[75vh]">
          <LazyImage
            src={article.coverImage}
            alt={article.title}
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/90 via-deep-brown/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <span className="inline-block px-3 py-1 text-xs font-sans font-medium tracking-widest uppercase text-primary-foreground bg-primary/90 mb-4">
              {altitudeLabels[article.altitude]}
            </span>
            <h2 className="text-editorial-heading text-3xl md:text-5xl lg:text-6xl text-primary-foreground mb-3 max-w-3xl">
              {article.title}
            </h2>
            <p className="font-sans text-primary-foreground/80 text-sm md:text-base max-w-2xl mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-primary-foreground/70 text-xs font-sans">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              <button
                onClick={handleLike}
                className="flex items-center gap-1 ml-auto transition-transform"
                aria-label={liked ? "Unlike" : "Like"}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${liked ? "fill-primary text-primary animate-heart-pop" : "text-primary-foreground/70"}`}
                />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-sm aspect-[4/5]">
        <LazyImage
          src={article.coverImage}
          alt={article.title}
          aspectRatio="portrait"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-transform hover:scale-110"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={`w-4 h-4 transition-all ${liked ? "fill-primary text-primary animate-heart-pop" : "text-foreground"}`}
          />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-primary">
            {altitudeLabels[article.altitude]}
          </span>
          {article.fabricTags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-sans text-muted-foreground">
              · {tag}
            </span>
          ))}
        </div>
        <h3 className="text-editorial-heading text-lg md:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="font-sans text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-xs font-sans text-muted-foreground pt-1">
          <span>{article.author}</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {likeCount}
          </span>
          {article.reviewCount > 0 && (
            <span>★ {article.avgRating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
