import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/ArticleCard";
import type { Article, AltitudeCategory } from "@/data/articles";

interface RelatedArticlesProps {
  currentSlug: string;
  altitude: AltitudeCategory;
}

const RelatedArticles = ({ currentSlug, altitude }: RelatedArticlesProps) => {
  const [related, setRelated] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .eq("altitude", altitude)
      .neq("slug", currentSlug)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          setRelated(data.map(a => ({
            id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt,
            coverImage: a.cover_image, altitude: a.altitude as AltitudeCategory,
            author: a.author, designer: a.designer ?? undefined,
            fabricTags: a.fabric_tags ?? [], totalLikes: 0,
            avgRating: 0, reviewCount: 0, publishedAt: a.created_at, body: a.body,
          })));
        }
      });
  }, [currentSlug, altitude]);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h3 className="text-editorial-heading text-2xl text-foreground mb-6">More from this altitude</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {related.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
    </section>
  );
};

export default RelatedArticles;
