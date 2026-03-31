import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import { altitudeLabels, altitudeDescriptions, type AltitudeCategory, type Article } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";

const ArchivePage = () => {
  const { category } = useParams<{ category: string }>();
  const altitude = category as AltitudeCategory;
  const validCategories: AltitudeCategory[] = ["peak", "plateau", "foothills", "heritage"];
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!validCategories.includes(altitude)) return;
    const fetchDbArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("altitude", altitude)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data) {
        setDbArticles(
          data.map((a) => ({
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
          }))
        );
      }
    };
    fetchDbArticles();
  }, [altitude]);

  if (!validCategories.includes(altitude)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-editorial-heading text-3xl text-foreground mb-4">Category Not Found</h1>
          <p className="font-sans text-muted-foreground">This altitude does not exist on our mountain.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = dbArticles.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
          The Archives
        </span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">
          {altitudeLabels[altitude]}
        </h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          {altitudeDescriptions[altitude]}
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {dbArticles.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-editorial-heading text-2xl text-foreground mb-2">Coming Soon</h2>
            <p className="font-sans text-sm text-muted-foreground">
              Our editorial team is crafting stories for this altitude. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {dbArticles.map((article, i) => (
              <div key={article.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ArchivePage;
