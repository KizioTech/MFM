import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { articles as mockArticles } from "@/data/articles";


interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  altitude: string;
  published: boolean;
  created_at: string;
  author: string;
}

const AdminPosts = () => {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, altitude, published, created_at, author")
      .order("created_at", { ascending: false });

    if (!error && data) setArticles(data);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("articles")
      .update({ published: !current })
      .eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(current ? "Unpublished" : "Published");
    fetchArticles();
  };

  const deleteArticle = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Article deleted");
    fetchArticles();
  };

  const handleSeedMockData = async () => {
    setLoading(true);
    setLoading(true);
    const toastId = toast.loading("Migrating mock data...");
    
    try {
      let count = 0;
      for (const article of mockArticles) {
        // Fetch the local image as a Blob
        const res = await fetch(article.coverImage);
        const blob = await res.blob();
        
        const fileExt = article.coverImage.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `seed-${article.slug}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("post_images")
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("post_images")
          .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await supabase.from("articles").upsert({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          cover_image: publicData.publicUrl,
          altitude: article.altitude,
          author: article.author,
          designer: article.designer || null,
          fabric_tags: article.fabricTags,
          published: true, 
          body: article.body || article.excerpt
        }, { onConflict: 'slug' });

        if (dbError) throw dbError;
        count++;
      }
      toast.success(`Successfully migrated ${count} mock articles to database!`, { id: toastId });
      fetchArticles();
    } catch (error: any) {
      toast.error(`Migration failed: ${error.message}`, { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-editorial-heading text-2xl font-bold text-foreground">Posts</h2>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                Seed Mock Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Seed Mock Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will upload all mock article images to your new bucket and insert them to the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSeedMockData}>Seed Data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-md animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-sans text-sm mb-4">No articles yet</p>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="w-4 h-4 mr-2" />
              Create your first post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-sans font-medium text-foreground">{article.title}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs font-sans text-muted-foreground capitalize">{article.altitude}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-sans text-muted-foreground">{article.author}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-full ${
                      article.published
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {article.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {article.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePublish(article.id, article.published)}
                        title={article.published ? "Unpublish" : "Publish"}
                      >
                        {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/posts/${article.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the article
                              "<strong>{article.title}</strong>" and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteArticle(article.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default AdminPosts;
