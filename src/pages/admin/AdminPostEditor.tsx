import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const categories = [
  { value: "peak", label: "The Peak" },
  { value: "plateau", label: "The Plateau" },
  { value: "foothills", label: "The Foothills" },
  { value: "heritage", label: "Heritage Lab" },
];

const AdminPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    cover_image: "",
    altitude: "plateau",
    author: "",
    designer: "",
    fabric_tags: "",
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast.error("Article not found");
            navigate("/admin/posts");
            return;
          }
          setForm({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            body: data.body,
            cover_image: data.cover_image,
            altitude: data.altitude,
            author: data.author,
            designer: data.designer ?? "",
            fabric_tags: (data.fabric_tags ?? []).join(", "),
            published: data.published,
          });
          setLoading(false);
        });
    }
  }, [id, isNew, navigate]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      ...(isNew ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body,
      cover_image: form.cover_image,
      altitude: form.altitude,
      author: form.author,
      designer: form.designer || null,
      fabric_tags: form.fabric_tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: publish !== undefined ? publish : form.published,
      ...(isNew ? { created_by: user?.id } : {}),
    };

    const query = isNew
      ? supabase.from("articles").insert(payload)
      : supabase.from("articles").update(payload).eq("id", id);

    const { error } = await query;
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isNew ? "Article created" : "Article updated");
    navigate("/admin/posts");
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <button
        onClick={() => navigate("/admin/posts")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </button>

      <h2 className="text-editorial-heading text-2xl font-bold text-foreground mb-6">
        {isNew ? "New Post" : "Edit Post"}
      </h2>

      <div className="space-y-5">
        <div>
          <Label htmlFor="title" className="font-sans text-sm">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title"
          />
        </div>

        <div>
          <Label htmlFor="slug" className="font-sans text-sm">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="article-slug"
          />
        </div>

        <div>
          <Label htmlFor="excerpt" className="font-sans text-sm">Excerpt</Label>
          <textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="Brief summary..."
            rows={3}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <Label htmlFor="body" className="font-sans text-sm">Body</Label>
          <textarea
            id="body"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Full article content..."
            rows={12}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <Label htmlFor="cover" className="font-sans text-sm">Cover Image URL</Label>
          <Input
            id="cover"
            value={form.cover_image}
            onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="altitude" className="font-sans text-sm">Category</Label>
            <select
              id="altitude"
              value={form.altitude}
              onChange={(e) => setForm((f) => ({ ...f, altitude: e.target.value }))}
              className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="author" className="font-sans text-sm">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="designer" className="font-sans text-sm">Designer (optional)</Label>
            <Input
              id="designer"
              value={form.designer}
              onChange={(e) => setForm((f) => ({ ...f, designer: e.target.value }))}
              placeholder="Designer name"
            />
          </div>
          <div>
            <Label htmlFor="tags" className="font-sans text-sm">Fabric Tags (comma separated)</Label>
            <Input
              id="tags"
              value={form.fabric_tags}
              onChange={(e) => setForm((f) => ({ ...f, fabric_tags: e.target.value }))}
              placeholder="Chitenje, Silk"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button onClick={() => handleSave()} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave(true)} variant="secondary" disabled={saving}>
            {saving ? "Saving..." : "Save & Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPostEditor;
