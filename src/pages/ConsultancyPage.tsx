import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import { supabase } from "@/integrations/supabase/client";
import ServiceCard from "@/components/ServiceCard";
import DiscoverEmptyState from "@/components/DiscoverEmptyState";

export interface Service {
  id: string; slug: string; title: string; description: string;
  provider: string; category: string; rate_display: string; image_url: string;
}

const CATS = ["All", "Styling", "Photography", "Design", "Other"];

const ConsultancyPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("available", true)
      .order("title")
      .then(({ data }) => {
        if (data) setServices(data as Service[]);
        setLoading(false);
      });
  }, []);

  const filtered = active === "All"
    ? services
    : services.filter(s => s.category.toLowerCase() === active.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">Discover</span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">Consultancy</h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Book Malawian stylists, photographers and fashion designers for your next project.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-2 flex-wrap">
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide border transition-colors ${
              active === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <DiscoverEmptyState
            title="Consultancy Coming Soon"
            subtitle="Malawian stylists, photographers and fashion designers will be listed here for booking. We're onboarding talent now."
            ctaLabel="Back to Home"
            ctaHref="/"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ConsultancyPage;
