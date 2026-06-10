import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DesignerRow { id: string; name: string; slug: string; location: string; created_at: string; }
interface ModelRow { id: string; display_name: string; slug: string; location: string; available: boolean; created_at: string; }
interface ServiceRow { id: string; title: string; slug: string; provider: string; category: string; available: boolean; created_at: string; }

type Tab = "designers" | "models" | "services";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors";

// ─── Component ───────────────────────────────────────────────────────────────

const AdminDirectory = () => {
  const [tab, setTab] = useState<Tab>("designers");

  // ── Designers ──
  const [designers, setDesigners] = useState<DesignerRow[]>([]);
  const [dForm, setDForm] = useState({ name: "", location: "", bio: "", avatar_url: "", cover_image: "" });
  const [dOpen, setDOpen] = useState(false);

  // ── Models ──
  const [models, setModels] = useState<ModelRow[]>([]);
  const [mForm, setMForm] = useState({ display_name: "", location: "", bio: "", avatar_url: "", height_cm: "" });
  const [mOpen, setMOpen] = useState(false);

  // ── Services ──
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [sForm, setSForm] = useState({ title: "", provider: "", category: "Styling", description: "", rate_display: "", image_url: "" });
  const [sOpen, setSOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch ──
  const fetchAll = async () => {
    setLoading(true);
    const [d, m, s] = await Promise.all([
      supabase.from("designers").select("id, name, slug, location, created_at").order("name"),
      supabase.from("model_profiles").select("id, display_name, slug, location, available, created_at").order("display_name"),
      supabase.from("services").select("id, title, slug, provider, category, available, created_at").order("title"),
    ]);
    if (d.data) setDesigners(d.data);
    if (m.data) setModels(m.data);
    if (s.data) setServices(s.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Create handlers ──
  const createDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("designers").insert({
      name: dForm.name, slug: slugify(dForm.name), location: dForm.location,
      bio: dForm.bio, avatar_url: dForm.avatar_url || "/placeholder.svg", cover_image: dForm.cover_image || "/placeholder.svg",
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Designer added");
    setDForm({ name: "", location: "", bio: "", avatar_url: "", cover_image: "" });
    setDOpen(false);
    fetchAll();
  };

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("model_profiles").insert({
      display_name: mForm.display_name, slug: slugify(mForm.display_name), location: mForm.location,
      bio: mForm.bio, avatar_url: mForm.avatar_url || "/placeholder.svg",
      height_cm: mForm.height_cm ? parseInt(mForm.height_cm) : null, available: true,
      experience_tags: [], portfolio_urls: [],
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Model added");
    setMForm({ display_name: "", location: "", bio: "", avatar_url: "", height_cm: "" });
    setMOpen(false);
    fetchAll();
  };

  const createService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("services").insert({
      title: sForm.title, slug: slugify(sForm.title), provider: sForm.provider,
      category: sForm.category, description: sForm.description,
      rate_display: sForm.rate_display, image_url: sForm.image_url || "/placeholder.svg", available: true,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Service added");
    setSForm({ title: "", provider: "", category: "Styling", description: "", rate_display: "", image_url: "" });
    setSOpen(false);
    fetchAll();
  };

  // ── Delete handlers ──
  const deleteRow = async (table: string, id: string, label: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(`Failed to delete ${label}`); return; }
    toast.success(`${label} deleted`);
    fetchAll();
  };

  // ── Table helper ──
  const THead = ({ cols }: { cols: string[] }) => (
    <thead>
      <tr className="bg-muted/50">
        {cols.map(c => (
          <th key={c} className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">{c}</th>
        ))}
        <th className="text-right px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
      </tr>
    </thead>
  );

  const DeleteBtn = ({ table, id, label }: { table: string; id: string; label: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{label}"?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRow(table, id, label)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "designers", label: "Designers", count: designers.length },
    { key: "models", label: "Models", count: models.length },
    { key: "services", label: "Services", count: services.length },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-editorial-heading text-2xl font-bold text-foreground">Directory</h2>
        <Button onClick={() => { if (tab === "designers") setDOpen(true); else if (tab === "models") setMOpen(true); else setSOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add {tab === "designers" ? "Designer" : tab === "models" ? "Model" : "Service"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-sans font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t.label} <span className="ml-1 text-xs text-muted-foreground">({t.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-card border border-border rounded-md animate-pulse" />)}</div>
      ) : (
        <>
          {/* ─── Designers Tab ─── */}
          {tab === "designers" && (
            <>
              {dOpen && (
                <form onSubmit={createDesigner} className="bg-card border border-border rounded-md p-5 mb-6 space-y-3">
                  <h3 className="font-sans text-sm font-semibold text-foreground mb-2">New Designer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Name *" required value={dForm.name} onChange={e => setDForm(f => ({ ...f, name: e.target.value }))} />
                    <input className={inputCls} placeholder="Location (e.g. Lilongwe)" value={dForm.location} onChange={e => setDForm(f => ({ ...f, location: e.target.value }))} />
                    <input className={inputCls} placeholder="Avatar URL" value={dForm.avatar_url} onChange={e => setDForm(f => ({ ...f, avatar_url: e.target.value }))} />
                    <input className={inputCls} placeholder="Cover Image URL" value={dForm.cover_image} onChange={e => setDForm(f => ({ ...f, cover_image: e.target.value }))} />
                  </div>
                  <textarea className={inputCls + " resize-none"} rows={3} placeholder="Short bio…" value={dForm.bio} onChange={e => setDForm(f => ({ ...f, bio: e.target.value }))} />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setDOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Designer"}</Button>
                  </div>
                </form>
              )}
              {designers.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground font-sans text-sm">No designers yet. Click "Add Designer" to create one.</p>
              ) : (
                <div className="border border-border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <THead cols={["Name", "Location", "Created"]} />
                    <tbody className="divide-y divide-border">
                      {designers.map(d => (
                        <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-sans text-sm font-medium text-foreground">{d.name}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{d.location}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString("en-GB")}</td>
                          <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild><a href={`/designers/${d.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></a></Button>
                            <DeleteBtn table="designers" id={d.id} label={d.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ─── Models Tab ─── */}
          {tab === "models" && (
            <>
              {mOpen && (
                <form onSubmit={createModel} className="bg-card border border-border rounded-md p-5 mb-6 space-y-3">
                  <h3 className="font-sans text-sm font-semibold text-foreground mb-2">New Model</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Display Name *" required value={mForm.display_name} onChange={e => setMForm(f => ({ ...f, display_name: e.target.value }))} />
                    <input className={inputCls} placeholder="Location" value={mForm.location} onChange={e => setMForm(f => ({ ...f, location: e.target.value }))} />
                    <input className={inputCls} placeholder="Avatar URL" value={mForm.avatar_url} onChange={e => setMForm(f => ({ ...f, avatar_url: e.target.value }))} />
                    <input className={inputCls} type="number" placeholder="Height (cm)" value={mForm.height_cm} onChange={e => setMForm(f => ({ ...f, height_cm: e.target.value }))} />
                  </div>
                  <textarea className={inputCls + " resize-none"} rows={3} placeholder="Short bio…" value={mForm.bio} onChange={e => setMForm(f => ({ ...f, bio: e.target.value }))} />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setMOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Model"}</Button>
                  </div>
                </form>
              )}
              {models.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground font-sans text-sm">No models yet. Click "Add Model" to create one.</p>
              ) : (
                <div className="border border-border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <THead cols={["Name", "Location", "Status", "Created"]} />
                    <tbody className="divide-y divide-border">
                      {models.map(m => (
                        <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-sans text-sm font-medium text-foreground">{m.display_name}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{m.location}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-sans px-2 py-1 rounded-full ${m.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                              {m.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString("en-GB")}</td>
                          <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild><a href={`/models/${m.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></a></Button>
                            <DeleteBtn table="model_profiles" id={m.id} label={m.display_name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ─── Services Tab ─── */}
          {tab === "services" && (
            <>
              {sOpen && (
                <form onSubmit={createService} className="bg-card border border-border rounded-md p-5 mb-6 space-y-3">
                  <h3 className="font-sans text-sm font-semibold text-foreground mb-2">New Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Service Title *" required value={sForm.title} onChange={e => setSForm(f => ({ ...f, title: e.target.value }))} />
                    <input className={inputCls} placeholder="Provider Name *" required value={sForm.provider} onChange={e => setSForm(f => ({ ...f, provider: e.target.value }))} />
                    <select className={inputCls} value={sForm.category} onChange={e => setSForm(f => ({ ...f, category: e.target.value }))}>
                      {["Styling", "Photography", "Design", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input className={inputCls} placeholder="Rate display (e.g. From MK 50,000)" value={sForm.rate_display} onChange={e => setSForm(f => ({ ...f, rate_display: e.target.value }))} />
                    <input className={inputCls} placeholder="Image URL" value={sForm.image_url} onChange={e => setSForm(f => ({ ...f, image_url: e.target.value }))} />
                  </div>
                  <textarea className={inputCls + " resize-none"} rows={3} placeholder="Description…" value={sForm.description} onChange={e => setSForm(f => ({ ...f, description: e.target.value }))} />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setSOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Service"}</Button>
                  </div>
                </form>
              )}
              {services.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground font-sans text-sm">No services yet. Click "Add Service" to create one.</p>
              ) : (
                <div className="border border-border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <THead cols={["Title", "Provider", "Category", "Status"]} />
                    <tbody className="divide-y divide-border">
                      {services.map(s => (
                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-sans text-sm font-medium text-foreground">{s.title}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{s.provider}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground capitalize">{s.category}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-sans px-2 py-1 rounded-full ${s.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                              {s.available ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DeleteBtn table="services" id={s.id} label={s.title} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDirectory;
