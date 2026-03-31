import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import { altitudeLabels, altitudeDescriptions, type AltitudeCategory, type Article } from "@/data/articles";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories: AltitudeCategory[] = ["peak", "plateau", "foothills", "heritage"];

const Index = () => {
  const [heroArticles, setHeroArticles] = useState<Article[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [trending, setTrending] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (heroArticles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroArticles.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroArticles.length]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(11); // Fetch 11 to use 5 for hero and 6 for trending
      
      if (data && data.length > 0) {
        const formattedArticles: Article[] = data.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          coverImage: a.cover_image,
          altitude: a.altitude as AltitudeCategory,
          author: a.author,
          designer: a.designer ?? undefined,
          fabricTags: a.fabric_tags ?? [],
          totalLikes: 0,
          avgRating: 0,
          reviewCount: 0,
          publishedAt: a.created_at,
          body: a.body,
        }));
        setHeroArticles(formattedArticles.slice(0, 5));
        setTrending(formattedArticles.slice(5, 11));
      }
      setIsLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden bg-muted">
        {isLoading ? (
          <ArticleSkeleton featured />
        ) : heroArticles.length > 0 ? (
          heroArticles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <ArticleCard article={article} featured />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-sans">
            No featured stories today.
          </div>
        )}
      </section>

      {/* Altitude Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-editorial-heading text-2xl md:text-3xl text-foreground mb-2">
            Choose Your Altitude
          </h2>
          <p className="font-sans text-sm text-muted-foreground">
            Every journey up the mountain begins with a single step
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/archives/${cat}`}
              className="group p-6 border border-border rounded-sm hover:border-primary hover:bg-primary/5 transition-all text-center"
            >
              <h3 className="text-editorial-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {altitudeLabels[cat]}
              </h3>
              <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                {altitudeDescriptions[cat].split("—")[0]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="altitude-divider max-w-7xl mx-auto" />

      {/* Trending Ascent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
              Trending Ascent
            </span>
            <h2 className="text-editorial-heading text-2xl md:text-3xl text-foreground mt-1">
              This Week's Most Loved
            </h2>
          </div>
          <Link to="/archives/peak" className="hidden md:flex items-center gap-1 font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            [...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)
          ) : trending.length > 0 ? (
            trending.map((article, i) => (
              <div key={article.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ArticleCard article={article} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground font-sans">
              More coming soon.
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Index;
