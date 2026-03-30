import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Heart, Mail } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ articles: 0, users: 0, likes: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [articlesRes, profilesRes, likesRes, subsRes] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("article_likes").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        articles: articlesRes.count ?? 0,
        users: profilesRes.count ?? 0,
        likes: likesRes.count ?? 0,
        subscribers: subsRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Articles", value: stats.articles, icon: FileText, color: "text-primary" },
    { label: "Users", value: stats.users, icon: Users, color: "text-secondary" },
    { label: "Total Likes", value: stats.likes, icon: Heart, color: "text-destructive" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-accent" },
  ];

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-md p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans text-muted-foreground uppercase tracking-wide">{card.label}</span>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-editorial-heading text-3xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
