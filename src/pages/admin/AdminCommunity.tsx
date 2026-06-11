import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Trash2, MessageSquare, Image, CheckCircle2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PendingPost {
  id: string; image_url: string; caption: string; created_at: string;
  user_id: string;
}

interface PendingComment {
  id: string; body: string; article_slug: string; created_at: string;
  user_id: string;
}

type Tab = "posts" | "comments" | "live_posts";

// ─── Component ───────────────────────────────────────────────────────────────

const AdminCommunity = () => {
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [livePosts, setLivePosts] = useState<PendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState<PendingPost | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [p, c, l] = await Promise.all([
      supabase
        .from("community_posts")
        .select("id, image_url, caption, created_at, user_id")
        .eq("approved", false)
        .order("created_at", { ascending: false }),
      supabase
        .from("article_comments")
        .select("id, body, article_slug, created_at, user_id")
        .eq("approved", false)
        .order("created_at", { ascending: false }),
      supabase
        .from("community_posts")
        .select("id, image_url, caption, created_at, user_id")
        .eq("approved", true)
        .order("created_at", { ascending: false }),
    ]);
    if (p.error) console.error("Posts fetch error:", p.error);
    if (c.error) console.error("Comments fetch error:", c.error);
    if (l.error) console.error("Live posts fetch error:", l.error);
    if (p.data) setPosts(p.data as unknown as PendingPost[]);
    if (c.data) setComments(c.data as unknown as PendingComment[]);
    if (l.data) setLivePosts(l.data as unknown as PendingPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Post actions ──
  const approvePost = async (id: string) => {
    const { error } = await supabase.from("community_posts").update({ approved: true }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Post approved");
    const approvedPost = posts.find(p => p.id === id);
    setPosts(prev => prev.filter(p => p.id !== id));
    if (approvedPost) setLivePosts(prev => [approvedPost, ...prev]);
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Post removed");
    setPosts(prev => prev.filter(p => p.id !== id));
    setLivePosts(prev => prev.filter(p => p.id !== id));
  };

  const handleEditClick = (post: PendingPost) => {
    setEditingPost(post);
    setEditCaption(post.caption);
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    const { error } = await supabase.from("community_posts").update({ caption: editCaption }).eq("id", editingPost.id);
    setIsSaving(false);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Post updated");
    setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, caption: editCaption } : p));
    setLivePosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, caption: editCaption } : p));
    setEditingPost(null);
  };

  // ── Comment actions ──
  const approveComment = async (id: string) => {
    const { error } = await supabase.from("article_comments").update({ approved: true }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Comment approved");
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("article_comments").delete().eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Comment removed");
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const tabs: { key: Tab; label: string; count: number; icon: any }[] = [
    { key: "posts", label: "Pending Posts", count: posts.length, icon: Image },
    { key: "live_posts", label: "Live Posts (Edit/Delete)", count: livePosts.length, icon: CheckCircle2 },
    { key: "comments", label: "Article Comments", count: comments.length, icon: MessageSquare },
  ];

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-editorial-heading text-2xl font-bold text-foreground mb-1">Community Posts & Comments</h2>
      <p className="font-sans text-sm text-muted-foreground mb-6">Review and manage community submissions and article comments.</p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-sans font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.count > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-sans font-semibold rounded-full bg-destructive text-destructive-foreground">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-card border border-border rounded-md animate-pulse" />)}</div>
      ) : (
        <>
          {/* ─── Posts ─── */}
          {tab === "posts" && (
            posts.length === 0 ? (
              <div className="text-center py-16">
                <Image className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-sans text-sm">No pending community posts</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(post => (
                  <div key={post.id} className="border border-border rounded-md overflow-hidden bg-card">
                    <img src={post.image_url} alt="Community submission" className="w-full aspect-square object-cover" />
                    <div className="p-3">
                      <p className="font-sans text-xs text-muted-foreground mb-1">
                        Community Member · {new Date(post.created_at).toLocaleDateString("en-GB")}
                      </p>
                      {post.caption && <p className="font-sans text-sm text-foreground line-clamp-2 mb-3">{post.caption}</p>}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approvePost(post.id)} className="flex-1">
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(post)} title="Edit Caption">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deletePost(post.id)} className="text-destructive hover:text-destructive" title="Delete Post">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── Comments ─── */}
          {tab === "comments" && (
            comments.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-sans text-sm">No pending comments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="border border-border rounded-md bg-card p-4 flex gap-4 items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-muted-foreground mb-1">
                        Community Member on <span className="text-primary font-medium">/article/{c.article_slug}</span> · {new Date(c.created_at).toLocaleDateString("en-GB")}
                      </p>
                      <p className="font-sans text-sm text-foreground">{c.body}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" onClick={() => approveComment(c.id)}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteComment(c.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── Live Posts ─── */}
          {tab === "live_posts" && (
            livePosts.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-sans text-sm">No live community posts</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {livePosts.map(post => (
                  <div key={post.id} className="border border-border rounded-md overflow-hidden bg-card">
                    <img src={post.image_url} alt="Community submission" className="w-full aspect-square object-cover" />
                    <div className="p-3">
                      <p className="font-sans text-xs text-muted-foreground mb-1">
                        Community Member · {new Date(post.created_at).toLocaleDateString("en-GB")}
                      </p>
                      {post.caption && <p className="font-sans text-sm text-foreground line-clamp-2 mb-3">{post.caption}</p>}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(post)} className="flex-1">
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deletePost(post.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* Edit Post Modal */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Community Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4 mt-2">
              <img src={editingPost.image_url} alt="To edit" className="w-full h-48 object-cover rounded-md" />
              <div className="space-y-2">
                <Label htmlFor="edit-caption" className="font-sans">Caption</Label>
                <Textarea 
                  id="edit-caption" 
                  value={editCaption} 
                  onChange={(e) => setEditCaption(e.target.value)} 
                  className="font-sans min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
                <Button onClick={saveEdit} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunity;
