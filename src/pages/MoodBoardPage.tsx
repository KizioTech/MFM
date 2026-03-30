import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getArticleBySlug } from "@/data/articles";

const MoodBoardPage = () => {
  const { user } = useAuth();
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      const { data } = await supabase
        .from("mood_board")
        .select("article_slug")
        .eq("user_id", user.id);
      setSavedSlugs(data?.map((d) => d.article_slug) || []);
      setLoading(false);
    };
    fetchSaved();
  }, [user]);

  const handleRemove = async (slug: string) => {
    if (!user) return;
    await supabase
      .from("mood_board")
      .delete()
      .eq("user_id", user.id)
      .eq("article_slug", slug);
    setSavedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const articles = savedSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <header className="paper-grain bg-deep-brown py-12 md:py-16 px-4 text-center">
        <Bookmark className="w-8 h-8 text-primary mx-auto mb-3" />
        <h1 className="text-editorial-heading text-3xl md:text-4xl text-primary-foreground">
          Your Mood Board
        </h1>
        <p className="font-sans text-sm text-primary-foreground/70 mt-2">
          Saved looks and inspiration
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <p className="text-center text-muted-foreground font-sans text-sm">Loading...</p>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-sans mb-4">
              You haven't saved any looks yet.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              Explore Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) =>
              article ? (
                <div key={article.slug} className="group relative border border-border rounded-sm overflow-hidden">
                  <Link to={`/article/${article.slug}`}>
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/article/${article.slug}`}>
                      <h3 className="text-editorial-heading text-lg text-foreground group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="font-sans text-xs text-muted-foreground mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(article.slug)}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-sm text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove from mood board"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MoodBoardPage;
