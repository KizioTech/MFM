import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Bookmark, Star, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import LazyImage from "@/components/LazyImage";
import { altitudeLabels, type Article, type AltitudeCategory } from "@/data/articles";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | undefined>();
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch from DB if not a static article
  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const fetchFromDb = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (data) {
        setArticle({
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          coverImage: data.cover_image,
          altitude: data.altitude as AltitudeCategory,
          author: data.author,
          designer: data.designer ?? undefined,
          fabricTags: data.fabric_tags ?? [],
          totalLikes: 0,
          avgRating: 0,
          reviewCount: 0,
          publishedAt: data.created_at,
          body: data.body,
        });
      }
      setLoading(false);
    };
    fetchFromDb();
  }, [slug]);

  // Fetch like count and user's like/save state
  useEffect(() => {
    if (!slug) return;

    const fetchLikes = async () => {
      const { count } = await supabase
        .from("article_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_slug", slug);
      setLikeCount(count || 0);
    };
    fetchLikes();

    if (user) {
      const fetchUserState = async () => {
        const [likeRes, saveRes] = await Promise.all([
          supabase
            .from("article_likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("article_slug", slug)
            .maybeSingle(),
          supabase
            .from("mood_board")
            .select("id")
            .eq("user_id", user.id)
            .eq("article_slug", slug)
            .maybeSingle(),
        ]);
        setLiked(!!likeRes.data);
        setSaved(!!saveRes.data);
      };
      fetchUserState();
    }
  }, [slug, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ArticleSkeleton featured />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
          <div className="flex gap-4 border-b border-border pb-6">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-sm" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded-sm" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded-sm" />
            <div className="h-4 w-full bg-muted animate-pulse rounded-sm" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded-sm" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-editorial-heading text-3xl text-foreground mb-4">Article Not Found</h1>
          <Link to="/" className="font-sans text-sm text-primary hover:underline">Return to homepage</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (liked) {
      await supabase
        .from("article_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("article_slug", slug!);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase
        .from("article_likes")
        .insert({ user_id: user.id, article_slug: slug! });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (saved) {
      await supabase
        .from("mood_board")
        .delete()
        .eq("user_id", user.id)
        .eq("article_slug", slug!);
      setSaved(false);
    } else {
      await supabase
        .from("mood_board")
        .insert({ user_id: user.id, article_slug: slug! });
      setSaved(true);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating > 0 && reviewText.length >= 10) {
      setReviewSubmitted(true);
    }
  };

  const paragraphs = article.body?.split("\n\n") || [article.excerpt];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <LazyImage
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-deep-brown/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 pointer-events-none">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-sans font-medium tracking-widest uppercase text-primary-foreground bg-primary/90 mb-4">
              {altitudeLabels[article.altitude]}
            </span>
            <h1 className="text-editorial-heading text-3xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70 text-sm font-sans">
              <span>By {article.author}</span>
              {article.designer && (
                <>
                  <span>•</span>
                  <span>Featuring {article.designer}</span>
                </>
              )}
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Engagement Bar */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border hover:border-primary transition-colors"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart className={`w-5 h-5 transition-all ${liked ? "fill-primary text-primary animate-heart-pop" : "text-muted-foreground"}`} />
            <span className="font-sans text-sm text-foreground">{likeCount}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border hover:border-primary transition-colors"
            aria-label={saved ? "Remove from mood board" : "Save to mood board"}
          >
            <Bookmark className={`w-5 h-5 transition-all ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            <span className="font-sans text-sm text-foreground">{saved ? "Saved" : "Save"}</span>
          </button>
          {article.reviewCount > 0 && (
            <div className="ml-auto flex items-center gap-1 text-sm font-sans text-muted-foreground">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-foreground font-medium">{article.avgRating.toFixed(1)}</span>
              <span>({article.reviewCount} reviews)</span>
            </div>
          )}
        </div>

        {/* Fabric Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.fabricTags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-sans font-medium tracking-wide text-muted-foreground bg-muted rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="prose-article space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans text-base leading-relaxed text-foreground/90">
              {i === 0 && <span className="text-editorial-heading text-5xl float-left mr-3 mt-1 leading-none text-primary">{p.charAt(0)}</span>}
              {i === 0 ? p.slice(1) : p}
            </p>
          ))}
        </div>

        <div className="altitude-divider my-12" />

        {/* Review Section */}
        {article.altitude !== "heritage" && (
          <section>
            <h3 className="text-editorial-heading text-2xl text-foreground mb-6">Rate the Look</h3>

            {reviewSubmitted ? (
              <div className="p-6 bg-muted rounded-sm text-center">
                <p className="font-sans text-sm text-foreground">Your review has been submitted! It will appear after moderation.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || userRating)
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="ml-2 font-sans text-sm text-muted-foreground">{userRating}/5</span>
                  )}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts on this look (minimum 10 characters)..."
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={userRating === 0 || reviewText.length < 10}
                  className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium tracking-wide rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </form>
            )}
          </section>
        )}
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
        <Link to="/" className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to homepage
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default ArticlePage;
