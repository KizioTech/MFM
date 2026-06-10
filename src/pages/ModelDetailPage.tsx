import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LazyImage from "@/components/LazyImage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ModelProfile } from "@/hooks/useModels";
import useSEO from "@/hooks/useSEO";

const ModelDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [model, setModel] = useState<ModelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", project_type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: model ? `${model.display_name} — Models — MFM` : "Model",
    description: model?.bio ?? "",
    image: model?.avatar_url,
  });

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("model_profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setModel(data as ModelProfile);
        setLoading(false);
      });
  }, [slug]);

  // Pre-fill from session
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setForm(f => ({
          ...f,
          email: user.email ?? "",
          name: data?.display_name ?? "",
        }));
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;
    setSubmitting(true);
    const { error } = await supabase.from("model_booking_requests").insert({
      model_id: model.id,
      requester_id: user?.id ?? null,
      name: form.name,
      email: form.email,
      message: form.message,
      project_type: form.project_type,
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to send request. Please try again."); return; }
    setSubmitted(true);
    toast.success("Booking request sent!");
  };

  if (loading || !model) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Portfolio column */}
        <div>
          <div className="overflow-hidden rounded-sm aspect-[3/4] mb-4">
            <LazyImage src={model.avatar_url} alt={model.display_name} aspectRatio="portrait" />
          </div>
          {model.portfolio_urls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {model.portfolio_urls.slice(0, 6).map((url, i) => (
                <LazyImage key={i} src={url} alt={`Portfolio ${i + 1}`} aspectRatio="square"
                  className="rounded-sm" />
              ))}
            </div>
          )}
        </div>

        {/* Info + booking column */}
        <div>
          <Link to="/models" className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Models
          </Link>
          <h1 className="text-editorial-heading text-3xl md:text-4xl mb-1">{model.display_name}</h1>
          <p className="font-sans text-sm text-muted-foreground mb-2">{model.location}</p>
          {model.height_cm && (
            <p className="font-sans text-sm text-muted-foreground mb-4">Height: {model.height_cm} cm</p>
          )}
          <div className="flex gap-2 flex-wrap mb-6">
            {model.experience_tags.map(t => (
              <span key={t} className="text-xs font-sans px-3 py-1 bg-muted text-muted-foreground rounded-sm capitalize">
                {t}
              </span>
            ))}
          </div>
          <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-10">{model.bio}</p>

          <div className="altitude-divider mb-8" />
          <h2 className="text-editorial-heading text-xl mb-6">Send a Booking Request</h2>

          {submitted ? (
            <p className="font-sans text-sm text-primary">
              Request sent. {model.display_name}'s team will be in touch shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(["name", "email", "project_type"] as const).map(field => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field === "project_type" ? "Project type (e.g. runway, editorial)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                />
              ))}
              <textarea
                placeholder="Tell us about the project..."
                rows={4}
                required
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40">
                <Send className="w-4 h-4" />
                {submitting ? "Sending…" : "Send Request"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModelDetailPage;
