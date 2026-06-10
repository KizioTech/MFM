import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EventRow {
  id: string; title: string; slug: string; location: string;
  starts_at: string; published: boolean; free: boolean; created_at: string;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const inputCls = "w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors";

const AdminEvents = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", location: "", cover_image: "",
    starts_at: "", ends_at: "", ticket_url: "", free: false,
  });

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title, slug, location, starts_at, published, free, created_at")
      .order("starts_at", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("events").insert({
      title: form.title, slug: slugify(form.title), description: form.description,
      location: form.location, cover_image: form.cover_image || "/placeholder.svg",
      starts_at: form.starts_at, ends_at: form.ends_at || null,
      ticket_url: form.ticket_url || null, free: form.free, published: false,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Event created (draft)");
    setForm({ title: "", description: "", location: "", cover_image: "", starts_at: "", ends_at: "", ticket_url: "", free: false });
    setFormOpen(false);
    fetchEvents();
  };

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from("events").update({ published: !current }).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(current ? "Unpublished" : "Published");
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Event deleted");
    fetchEvents();
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-editorial-heading text-2xl font-bold text-foreground">Events</h2>
        <Button onClick={() => setFormOpen(!formOpen)}>
          <Plus className="w-4 h-4 mr-2" /> New Event
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={createEvent} className="bg-card border border-border rounded-md p-5 mb-6 space-y-3">
          <h3 className="font-sans text-sm font-semibold text-foreground mb-2">Create Event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={inputCls} placeholder="Event Title *" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <input className={inputCls} placeholder="Location *" required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <div>
              <label className="block text-xs font-sans text-muted-foreground mb-1">Starts at *</label>
              <input className={inputCls} type="datetime-local" required value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-sans text-muted-foreground mb-1">Ends at (optional)</label>
              <input className={inputCls} type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))} />
            </div>
            <input className={inputCls} placeholder="Cover Image URL" value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} />
            <input className={inputCls} placeholder="Ticket URL (optional)" value={form.ticket_url} onChange={e => setForm(f => ({ ...f, ticket_url: e.target.value }))} />
          </div>
          <textarea className={inputCls + " resize-none"} rows={4} placeholder="Event description…" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <label className="flex items-center gap-2 font-sans text-sm text-foreground">
            <input type="checkbox" checked={form.free} onChange={e => setForm(f => ({ ...f, free: e.target.checked }))} className="rounded border-border" />
            Free event
          </label>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Event"}</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-card border border-border rounded-md animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-sans text-sm mb-4">No events yet</p>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create your first event
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-sans font-medium text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-sans text-sm font-medium text-foreground">{ev.title}</span>
                    {ev.free && <span className="ml-2 text-[10px] font-sans px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">Free</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell font-sans text-xs text-muted-foreground">{ev.location}</td>
                  <td className="px-4 py-3 hidden md:table-cell font-sans text-xs text-muted-foreground">{fmt(ev.starts_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-full ${
                      ev.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {ev.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {ev.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(ev.id, ev.published)} title={ev.published ? "Unpublish" : "Publish"}>
                        {ev.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" asChild><a href={`/events/${ev.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></a></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{ev.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteEvent(ev.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

export default AdminEvents;
