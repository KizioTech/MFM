import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Heart, Mail, Layers, CalendarDays, Image, MessageSquare } from "lucide-react";

interface Stats {
  articles: number; users: number; likes: number; subscribers: number;
  designers: number; models: number; events: number;
  pendingPosts: number; pendingComments: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    articles: 0, users: 0, likes: 0, subscribers: 0,
    designers: 0, models: 0, events: 0, pendingPosts: 0, pendingComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, profilesRes, likesRes, subsRes, designersRes, modelsRes, eventsRes, pendPostsRes, pendCommentsRes] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("article_likes").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("designers").select("id", { count: "exact", head: true }),
        supabase.from("model_profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("approved", false),
        supabase.from("article_comments").select("id", { count: "exact", head: true }).eq("approved", false),
      ]);
      setStats({
        articles: articlesRes.count ?? 0,
        users: profilesRes.count ?? 0,
        likes: likesRes.count ?? 0,
        subscribers: subsRes.count ?? 0,
        designers: designersRes.count ?? 0,
        models: modelsRes.count ?? 0,
        events: eventsRes.count ?? 0,
        pendingPosts: pendPostsRes.count ?? 0,
        pendingComments: pendCommentsRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const primaryCards = [
    { label: "Articles", value: stats.articles, icon: FileText, color: "text-primary", href: "/admin/posts" },
    { label: "Users", value: stats.users, icon: Users, color: "text-blue-500", href: "/admin/users" },
    { label: "Total Likes", value: stats.likes, icon: Heart, color: "text-destructive" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-green-500", href: "/admin/newsletter" },
  ];

  const directoryCards = [
    { label: "Designers", value: stats.designers, icon: Layers, href: "/admin/directory" },
    { label: "Models", value: stats.models, icon: Users, href: "/admin/directory" },
    { label: "Live Events", value: stats.events, icon: CalendarDays, href: "/admin/events" },
  ];

  const pendingTotal = stats.pendingPosts + stats.pendingComments;

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-editorial-heading text-2xl font-bold text-foreground mb-6">Dashboard</h2>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Primary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {primaryCards.map((card) => {
              const inner = (
                <div className="bg-card border border-border rounded-md p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-sans text-muted-foreground uppercase tracking-wide">{card.label}</span>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-editorial-heading text-3xl font-bold text-foreground">{card.value}</p>
                </div>
              );
              return card.href ? <Link key={card.label} to={card.href}>{inner}</Link> : <div key={card.label}>{inner}</div>;
            })}
          </div>

          {/* Directory stats */}
          <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Directory</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {directoryCards.map(card => (
              <Link key={card.label} to={card.href} className="bg-card border border-border rounded-md p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-sans text-muted-foreground uppercase tracking-wide">{card.label}</span>
                  <card.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-editorial-heading text-2xl font-bold text-foreground">{card.value}</p>
              </Link>
            ))}
          </div>

          {/* Moderation summary */}
          {pendingTotal > 0 && (
            <Link to="/admin/community"
              className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 rounded-md p-5 hover:border-destructive/40 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                <MessageSquare className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">
                  {pendingTotal} item{pendingTotal > 1 ? "s" : ""} awaiting moderation
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {stats.pendingPosts > 0 && `${stats.pendingPosts} community post${stats.pendingPosts > 1 ? "s" : ""}`}
                  {stats.pendingPosts > 0 && stats.pendingComments > 0 && " · "}
                  {stats.pendingComments > 0 && `${stats.pendingComments} comment${stats.pendingComments > 1 ? "s" : ""}`}
                </p>
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

