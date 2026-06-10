import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

const ArticleComments = ({ articleSlug }: { articleSlug: string }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("article_comments")
      .select("id, body, created_at, profiles(display_name, avatar_url)")
      .eq("article_slug", articleSlug)
      .eq("approved", true)
      .order("created_at")
      .then(({ data }) => {
        if (data) setComments(data as unknown as Comment[]);
      });
  }, [articleSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/auth"); return; }
    if (body.trim().length < 3) return;
    setSubmitting(true);
    const { error } = await supabase.from("article_comments").insert({
      article_slug: articleSlug,
      user_id: user.id,
      body: body.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to post comment"); return; }
    setBody("");
    toast.success("Comment submitted for review.");
  };

  return (
    <section className="mt-12">
      <h3 className="text-editorial-heading text-2xl text-foreground mb-6">
        {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? "s" : ""}` : "Be the first to comment"}
      </h3>

      <div className="space-y-6 mb-10">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {c.profiles?.avatar_url
                ? <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                : <span className="text-xs text-primary font-sans">{(c.profiles?.display_name ?? "A")[0]}</span>
              }
            </div>
            <div>
              <p className="font-sans text-xs text-muted-foreground mb-1">
                {c.profiles?.display_name ?? "Anonymous"} ·{" "}
                {new Date(c.created_at).toLocaleDateString("en-GB")}
              </p>
              <p className="font-sans text-sm text-foreground/90">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={user ? "Share your thoughts…" : "Sign in to comment"}
          rows={3}
          disabled={!user}
          maxLength={1000}
          className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || body.trim().length < 3 || !user}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </section>
  );
};

export default ArticleComments;
