import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import { useModels } from "@/hooks/useModels";
import ModelCard from "@/components/ModelCard";
import DiscoverEmptyState from "@/components/DiscoverEmptyState";

const TAGS = ["All", "Runway", "Editorial", "Commercial", "Fitness", "Plus size"];

const ModelsPage = () => {
  const { models, loading } = useModels();
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? models
    : models.filter(m => m.experience_tags.map(t => t.toLowerCase()).includes(active.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">Discover</span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">Models</h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Malawian modelling talent available for runway, editorial and commercial work.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-2 flex-wrap">
        {TAGS.map(tag => (
          <button key={tag} onClick={() => setActive(tag)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide border transition-colors ${
              active === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}>
            {tag}
          </button>
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <DiscoverEmptyState
            title="Models Coming Soon"
            subtitle="We're building a roster of Malawian modelling talent for runway, editorial and commercial work. Profiles will appear here shortly."
            ctaLabel="Back to Home"
            ctaHref="/"
            placeholderCount={8}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((m, i) => (
              <div key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <ModelCard model={m} />
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ModelsPage;
