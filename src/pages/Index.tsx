import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NewsletterSignup from "@/components/NewsletterSignup";
import { HeroSection } from "@/components/blocks/hero-section-5";
import Footer from "@/components/Footer";
import {
  altitudeLabels,
  altitudeDescriptions,
  type AltitudeCategory,
  type Article,
} from "@/data/articles";
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import useSEO from "@/hooks/useSEO";

const categories: AltitudeCategory[] = [
  "peak",
  "plateau",
  "foothills",
  "heritage",
];

const Index = () => {
  const [trending, setTrending] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useSEO({
    title: "Mountain Fashion Magazine — Malawian Heritage Meets Modern Fashion",
    description:
      "A social editorial platform celebrating Malawian fashion culture.",
  });

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
        setTrending(formattedArticles.slice(0, 6));
      }
      setIsLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroSection trending={trending} isLoading={isLoading} />

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

      {/* Discover Platform Features */}
      <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-sans text-xs font-semibold tracking-widest uppercase rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              More Than A Magazine
            </span>
            <h2 className="text-editorial-heading text-3xl md:text-5xl text-foreground mb-4">
              Discover The Ecosystem
            </h2>
            <p className="font-sans text-sm text-muted-foreground max-w-xl mx-auto">
              Connecting Malawian fashion creatives, professionals, and
              enthusiasts across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/designers"
              className="md:col-span-2 group relative overflow-hidden rounded-md bg-card border border-border p-8 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Users className="w-64 h-64" />
              </div>
              <div>
                <h3 className="text-editorial-heading text-2xl text-foreground group-hover:text-primary transition-colors mb-2">
                  Designer & Model Directory
                </h3>
                <p className="font-sans text-sm text-muted-foreground max-w-md leading-relaxed">
                  Browse profiles of Malawian designers, ateliers, and modelling
                  talent available for bookings and collaborations. Find the
                  perfect fit for your next project.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-primary">
                Explore Directory{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/consultancy"
              className="group relative overflow-hidden rounded-md bg-card border border-border p-8 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Briefcase className="w-40 h-40" />
              </div>
              <div>
                <h3 className="text-editorial-heading text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                  Consultancy
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  Book stylists, photographers, and consultants seamlessly.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-primary">
                Find Talent{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/events"
              className="group relative overflow-hidden rounded-md bg-card border border-border p-8 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <CalendarDays className="w-40 h-40" />
              </div>
              <div>
                <h3 className="text-editorial-heading text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                  Events
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  Trunk shows, pop-ups, and runways across Malawi.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-primary">
                View Calendar{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/community"
              className="md:col-span-2 group relative overflow-hidden rounded-md bg-card border border-border p-8 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <MessageSquare className="w-64 h-64" />
              </div>
              <div>
                <h3 className="text-editorial-heading text-2xl text-foreground group-hover:text-primary transition-colors mb-2">
                  Community Lookbook
                </h3>
                <p className="font-sans text-sm text-muted-foreground max-w-md leading-relaxed">
                  Real looks from the Malawian fashion community. Submit your
                  daily styles, get inspired by others, and celebrate our shared
                  heritage.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-sans text-sm font-semibold tracking-wide text-primary">
                Join the Community{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Index;
