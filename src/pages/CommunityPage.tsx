import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LazyImage from "@/components/LazyImage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import DiscoverEmptyState from "@/components/DiscoverEmptyState";

interface CommunityPost {
  id: string; image_url: string; caption: string;
  fabric_tags: string[]; created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("id, image_url, caption, fabric_tags, created_at, profiles(display_name, avatar_url)")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(24);
    if (data) setPosts(data as unknown as CommunityPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Client-side size guard — 5 MB max
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("community_posts").upload(path, file);
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }

    const { data: pub } = supabase.storage.from("community_posts").getPublicUrl(path);

    const { error: dbErr } = await supabase.from("community_posts").insert({
      user_id: user.id,
      image_url: pub.publicUrl,
      caption: "",
      fabric_tags: [],
      approved: false,
    });

    setUploading(false);
    if (dbErr) { toast.error("Failed to save post"); return; }
    toast.success("Look submitted for review! It will appear once approved.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">Discover</span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">Community</h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Real looks from the Malawian fashion community. Submit yours.
        </p>
      </header>

      {/* Upload CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <p className="font-sans text-sm text-muted-foreground">Showing approved community looks</p>
        {user ? (
          <label className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Submit a Look"}
            <input type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        ) : (
          <Link to="/auth"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors">
            Sign in to Submit
          </Link>
        )}
      </div>

      {/* Masonry-style grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="break-inside-avoid bg-muted rounded-sm animate-pulse h-48" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <DiscoverEmptyState
            title="Community Lookbook"
            subtitle="Be the first to share your look! Upload an image and it will appear here once approved by our editors."
            ctaLabel={user ? "Submit a Look" : "Sign in to Submit"}
            ctaHref={user ? undefined : "/auth"}
            placeholderCount={8}
          />
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {posts.map(post => (
              <div key={post.id} className="break-inside-avoid rounded-sm overflow-hidden border border-border">
                <LazyImage src={post.image_url} alt={post.caption || "Community look"} aspectRatio="auto" />
                {post.caption && (
                  <div className="p-3">
                    <p className="font-sans text-xs text-foreground/80 line-clamp-2">{post.caption}</p>
                    {post.profiles?.display_name && (
                      <p className="font-sans text-[10px] text-muted-foreground mt-1">
                        by {post.profiles.display_name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default CommunityPage;
