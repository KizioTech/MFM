import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Instagram, Globe, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import LazyImage from "@/components/LazyImage";
import { supabase } from "@/integrations/supabase/client";
import type { Designer } from "@/hooks/useDesigners";
import type { Article, AltitudeCategory } from "@/data/articles";
import useSEO from "@/hooks/useSEO";

const DesignerDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: designer ? `${designer.name} — Mountain Fashion Magazine` : "Designer",
    description: designer?.bio ?? "",
    image: designer?.cover_image,
  });

  useEffect(() => {
    if (!slug) return;
    const run = async () => {
      // 1. Fetch designer first
      const { data: d } = await supabase
        .from("designers")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (d) {
        setDesigner(d as Designer);
        // 2. Only then fetch articles linked to this designer
        const { data: linked } = await supabase
          .from("articles")
          .select("*")
          .eq("published", true)
          .eq("designer_id", d.id)
          .order("created_at", { ascending: false })
          .limit(6);
        if (linked) {
          setArticles(linked.map(x => ({
            id: x.id, title: x.title, slug: x.slug, excerpt: x.excerpt,
            coverImage: x.cover_image, altitude: x.altitude as AltitudeCategory,
            author: x.author, designer: x.designer ?? undefined,
            fabricTags: x.fabric_tags ?? [], totalLikes: 0,
            avgRating: 0, reviewCount: 0, publishedAt: x.created_at, body: x.body,
          })));
        }
      }
      setLoading(false);
    };
    run();
  }, [slug]);

  if (loading) return null; // PageLoader from Suspense handles this

  if (!designer) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-editorial-heading text-3xl">Designer not found</h1>
        <Link to="/designers" className="text-sm text-primary mt-4 inline-block hover:underline">
          Back to Designers
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative h-[40vh] md:h-[55vh]">
        <LazyImage src={designer.cover_image} alt={designer.name} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-12 flex items-end gap-5">
          <img src={designer.avatar_url} alt={designer.name}
            className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-2 border-primary-foreground" />
          <div>
            <h1 className="text-editorial-heading text-3xl md:text-5xl text-primary-foreground">
              {designer.name}
            </h1>
            <p className="font-sans text-primary-foreground/70 text-sm">{designer.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          {designer.social_ig && (
            <a href={`https://instagram.com/${designer.social_ig}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" /> @{designer.social_ig}
            </a>
          )}
          {designer.social_web && (
            <a href={designer.social_web} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors">
              <Globe className="w-4 h-4" /> Website
            </a>
          )}
        </div>

        <p className="font-sans text-base text-foreground/80 leading-relaxed max-w-2xl mb-12">
          {designer.bio}
        </p>

        {articles.length > 0 && (
          <>
            <h2 className="text-editorial-heading text-2xl md:text-3xl mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </>
        )}

        <Link to="/designers" className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary transition-colors mt-12">
          <ArrowLeft className="w-4 h-4" /> All Designers
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default DesignerDetailPage;
