import { useState } from "react";
import LazyImage from "@/components/LazyImage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { Service } from "@/pages/ConsultancyPage";

const ServiceCard = ({ service }: { service: Service }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", preferred_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("service_bookings").insert({
      service_id: service.id,
      requester_id: user?.id ?? null,
      name: form.name,
      email: form.email,
      message: form.message,
      preferred_date: form.preferred_date || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to send enquiry."); return; }
    setSubmitted(true);
    toast.success("Enquiry sent!");
  };

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="relative aspect-[16/9]">
        <LazyImage src={service.image_url} alt={service.title} aspectRatio="landscape" />
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-sans font-medium rounded-sm capitalize">
          {service.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-editorial-heading text-lg mb-0.5">{service.title}</h3>
        <p className="font-sans text-xs text-muted-foreground mb-2">by {service.provider}</p>
        <p className="font-sans text-sm text-foreground/80 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans text-sm font-medium text-primary">{service.rate_display}</span>
          <button onClick={() => setOpen(!open)}
            className="px-4 py-2 bg-primary text-primary-foreground font-sans text-xs font-medium rounded-sm hover:bg-primary/90 transition-colors">
            {open ? "Close" : "Enquire"}
          </button>
        </div>
        {open && (
          submitted ? (
            <p className="font-sans text-sm text-primary py-2">Enquiry sent. We'll be in touch shortly.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-4">
              {(["name", "email"] as const).map(f => (
                <input key={f} type={f === "email" ? "email" : "text"}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={form[f]} required
                  onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors" />
              ))}
              <input type="date" value={form.preferred_date}
                onChange={e => setForm(prev => ({ ...prev, preferred_date: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors" />
              <textarea rows={3} placeholder="Describe your project..." required value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
              <button type="submit" disabled={submitting}
                className="w-full py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40">
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
