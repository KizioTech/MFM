import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import { articles, getTrendingArticles, altitudeLabels, altitudeDescriptions, type AltitudeCategory } from "@/data/articles";
import { ArrowRight } from "lucide-react";

const categories: AltitudeCategory[] = ["peak", "plateau", "foothills", "heritage"];

const Index = () => {
  const heroArticle = articles[0];
  const trending = getTrendingArticles();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <ArticleCard article={heroArticle} featured />
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
          {trending.map((article, i) => (
            <div key={article.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </section>

      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Index;
