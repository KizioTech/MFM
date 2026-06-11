import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import { CoverHero } from "@/components/blocks/CoverHero";
import { EditorialGrid } from "@/components/blocks/EditorialGrid";
import { AltitudeNavigator } from "@/components/blocks/AltitudeNavigator";
import { FeatureSpread } from "@/components/blocks/FeatureSpread";
import Footer from "@/components/Footer";
import type { Article, AltitudeCategory } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";
import useSEO from "@/hooks/useSEO";

import peak1 from "@/assets/article-peak-1.jpg";
import plateau1 from "@/assets/article-plateau-1.jpg";
import foothills1 from "@/assets/article-foothills-1.jpg";
import heritage1 from "@/assets/article-heritage-1.jpg";

const previewImages = {
  peak: peak1,
  plateau: plateau1,
  foothills: foothills1,
  heritage: heritage1,
};

const Index = () => {
  const [trending, setTrending] = useState<Article[]>([]);
  const [latestSlug, setLatestSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useSEO({
    title: "Mountain Fashion Magazine — Malawian Heritage Meets Modern Fashion",
    description: "A social editorial platform celebrating Malawian fashion culture.",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(11);

      if (data && data.length > 0) {
        // The most recent article's slug goes to the hero CTA
        setLatestSlug(data[0].slug);

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
        setTrending(formattedArticles.slice(0, 6));
      }
      setIsLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-bleed cover — Navbar overlays this via fixed positioning when transparent */}
      <CoverHero latestSlug={latestSlug} />

      {/* Editorial Grid — breathing room with sand background accent */}
      {!isLoading && trending.length > 0 && (
        <div className="bg-background">
          <EditorialGrid articles={trending} />
        </div>
      )}

      {/* Ochre fold divider */}
      <div className="altitude-divider mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12" />

      {/* Altitude Navigator */}
      <AltitudeNavigator previewImages={previewImages} />

      {/* Platform Feature Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <FeatureSpread
            image={peak1}
            label="Discover"
            title="Designers & Models"
            body="Browse Malawian ateliers, independent designers, and modelling talent available for bookings."
            href="/directory"
            cta="Explore Directory"
          />

          <FeatureSpread
            image={plateau1}
            label="Book"
            title="Consultancy"
            body="Stylists, photographers, and fashion consultants ready for your next project."
            href="/consultancy"
            cta="Find Talent"
            dark
          />

          <FeatureSpread
            image={foothills1}
            label="Attend"
            title="Events"
            body="Runway shows, trunk sales, and pop-up markets across Malawi."
            href="/events"
            cta="View Calendar"
            dark
          />

          <FeatureSpread
            image={heritage1}
            label="Join"
            title="Community Lookbook"
            body="Real looks from the Malawian fashion community. Submit yours."
            href="/community"
            cta="Join the Community"
          />
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Index;
