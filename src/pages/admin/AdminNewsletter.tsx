import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubscribers(data);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const deleteSubscriber = async (id: string) => {
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) { toast.error("Failed to remove"); return; }
    toast.success("Subscriber removed");
    fetchSubscribers();
  };

  const activeCount = subscribers.filter((s) => s.subscribed).length;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-editorial-heading text-2xl font-bold text-foreground">Newsletter</h2>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            {activeCount} active subscriber{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-card border border-border rounded-md animate-pulse" />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-sans text-sm">No subscribers yet</p>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-sans text-foreground">{sub.email}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs font-sans text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-sans px-2 py-1 rounded-full ${
                      sub.subscribed ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {sub.subscribed ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteSubscriber(sub.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
