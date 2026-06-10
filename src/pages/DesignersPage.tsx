import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDesigners } from "@/hooks/useDesigners";
import DesignerCard from "@/components/DesignerCard";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import DiscoverEmptyState from "@/components/DiscoverEmptyState";

const CATEGORIES = ["All", "Couture", "Streetwear", "Textile", "Accessories", "Ready-to-wear"];

const DesignersPage = () => {
  const { designers, loading } = useDesigners();
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? designers
    : designers.filter(d => d.categories.includes(active.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
          Discover
        </span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">
          Designers
        </h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Malawian brands, ateliers and independent creatives shaping African fashion.
        </p>
      </header>

      {/* Category filter pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide border transition-colors ${
              active === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
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
            title="Designers Coming Soon"
            subtitle="We're curating a directory of Malawi's most exciting fashion designers, ateliers and independent creatives. Check back soon."
            ctaLabel="Back to Home"
            ctaHref="/"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <div key={d.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <DesignerCard designer={d} />
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default DesignersPage;
