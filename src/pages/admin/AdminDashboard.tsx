import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Users, Heart, Mail, Layers, CalendarDays, Image, 
  MessageSquare, Plus, AlertCircle, ArrowUpRight
} from "lucide-react";
import type { Article } from "@/data/articles";

interface Stats {
  articles: number; users: number; likes: number; subscribers: number;
  designers: number; models: number; events: number; services: number;
  pendingPosts: number; pendingComments: number;
}

const StatCard = ({ label, value, trend, trendUp, icon: Icon, href }: any) => {
  const inner = (
    <div className="bg-white rounded-md border border-border p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-sans text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-editorial-heading text-3xl font-bold text-foreground mb-2">{value}</p>
      {trend && (
        <p className={`font-sans text-xs flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-muted-foreground'}`}>
          {trendUp && <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </p>
      )}
    </div>
  );
  return href ? <Link to={href}>{inner}</Link> : inner;
};

const ArticleRow = ({ article }: { article: any }) => (
  <div className="px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border hover:bg-muted/30 transition-colors">
    <div>
      <h4 className="font-serif text-base text-foreground mb-1 line-clamp-1">{article.title}</h4>
      <p className="font-sans text-xs text-muted-foreground">
        By {article.author} · {new Date(article.created_at).toLocaleDateString()}
      </p>
    </div>
    <div className="mt-2 md:mt-0">
      <Link to={`/admin/posts/edit/${article.slug}`} className="font-sans text-xs text-primary hover:underline">Edit</Link>
    </div>
  </div>
);

const AttentionItem = ({ icon: Icon, label, href, urgent = false }: any) => (
  <Link to={href} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors mb-2">
    <div className={`p-2 rounded-full ${urgent ? 'bg-amber-100' : 'bg-muted'}`}>
      <Icon className={`w-4 h-4 ${urgent ? 'text-amber-700' : 'text-muted-foreground'}`} />
    </div>
    <span className={`font-sans text-sm ${urgent ? 'text-amber-900 font-medium' : 'text-foreground'}`}>
      {label}
    </span>
  </Link>
);

const PlatformStat = ({ label, value, href }: any) => (
  <Link to={href} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border-b border-transparent hover:border-border">
    <span className="font-sans text-sm text-muted-foreground">{label}</span>
    <span className="font-sans text-sm font-semibold text-foreground">{value}</span>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    articles: 0, users: 0, likes: 0, subscribers: 0,
    designers: 0, models: 0, events: 0, services: 0,
    pendingPosts: 0, pendingComments: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        articlesRes, profilesRes, likesRes, subsRes, designersRes, modelsRes, 
        eventsRes, pendPostsRes, pendCommentsRes, recentArticlesRes, upcomingEventsRes,
        servicesRes
      ] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("article_likes").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("designers").select("id", { count: "exact", head: true }),
        supabase.from("model_profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("approved", false),
        supabase.from("article_comments").select("id", { count: "exact", head: true }).eq("approved", false),
        supabase.from("articles").select("id, title, slug, author, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("starts_at", new Date().toISOString()),
        supabase.from("services").select("id", { count: "exact", head: true })
      ]);
      setStats({
        articles: articlesRes.count ?? 0,
        users: profilesRes.count ?? 0,
        likes: likesRes.count ?? 0,
        subscribers: subsRes.count ?? 0,
        designers: designersRes.count ?? 0,
        models: modelsRes.count ?? 0,
        events: eventsRes.count ?? 0,
        services: servicesRes.count ?? 0,
        pendingPosts: pendPostsRes.count ?? 0,
        pendingComments: pendCommentsRes.count ?? 0,
      });
      if (recentArticlesRes.data) {
        setRecentArticles(recentArticlesRes.data);
      }
      setUpcomingEvents(upcomingEventsRes.count ?? 0);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const pendingCount = stats.pendingPosts + stats.pendingComments;

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center">
        <p className="font-sans text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. TOPBAR with quick actions */}
      <header className="bg-white border-b border-border px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl font-bold text-foreground">Good morning</h1>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <Link to="/admin/community"
              className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-xs font-sans font-medium text-amber-700 hover:bg-amber-100 transition-colors">
              <AlertCircle className="w-3.5 h-3.5" />
              {pendingCount} pending review
            </Link>
          )}
          <Link to="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-sans text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </header>

      <div className="p-6">
        {/* 2. STATS — with trend indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Articles"
            value={stats.articles}
            trend="+3 this month"
            trendUp
            icon={FileText}
            href="/admin/posts"
          />
          <StatCard
            label="Community Members"
            value={stats.users}
            trend="+12 this week"
            trendUp
            icon={Users}
            href="/admin/users"
          />
          <StatCard
            label="Newsletter Subs"
            value={stats.subscribers}
            trend="+5 today"
            trendUp
            icon={Mail}
            href="/admin/newsletter"
          />
          <StatCard
            label="Total Likes"
            value={stats.likes}
            icon={Heart}
          />
        </div>

        {/* 3. TWO-COLUMN lower area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent articles list — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-md border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold">Recent Posts</h3>
              <Link to="/admin/posts" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {recentArticles.length > 0 ? (
              recentArticles.map(a => (
                <ArticleRow key={a.id} article={a} />
              ))
            ) : (
              <div className="p-5 text-sm text-muted-foreground font-sans">No recent articles found.</div>
            )}
          </div>

          {/* Right panel — content health */}
          <div className="space-y-6">

            {/* Moderation queue */}
            <div className="bg-white rounded-md border border-border p-5">
              <h3 className="font-serif text-base font-semibold mb-4">Needs Attention</h3>
              <AttentionItem
                icon={MessageSquare}
                label={`${stats.pendingComments} comment${stats.pendingComments !== 1 ? 's' : ''} to review`}
                href="/admin/community"
                urgent={stats.pendingComments > 0}
              />
              <AttentionItem
                icon={Image}
                label={`${stats.pendingPosts} community post${stats.pendingPosts !== 1 ? 's' : ''} to review`}
                href="/admin/community"
                urgent={stats.pendingPosts > 0}
              />
              <AttentionItem
                icon={CalendarDays}
                label={upcomingEvents > 0 ? `${upcomingEvents} event${upcomingEvents !== 1 ? 's' : ''} coming up` : 'No upcoming events'}
                href="/admin/events"
                urgent={false}
              />
            </div>

            {/* Platform health */}
            <div className="bg-white rounded-md border border-border p-5">
              <h3 className="font-serif text-base font-semibold mb-4">Platform</h3>
              <PlatformStat label="Designers" value={stats.designers} href="/admin/directory" />
              <PlatformStat label="Models" value={stats.models} href="/admin/directory" />
              <PlatformStat label="Live Events" value={stats.events} href="/admin/events" />
              <PlatformStat label="Services" value={stats.services} href="/admin/directory" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
