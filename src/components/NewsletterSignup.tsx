import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        toast.info("You're already subscribed!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-deep-brown paper-grain py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-editorial-heading text-3xl md:text-4xl text-primary-foreground mb-3">
          Begin Your Ascent
        </h2>
        <p className="font-sans text-sm text-primary-foreground/70 mb-8 max-w-md mx-auto">
          Weekly editorial picks, trending looks, and exclusive designer spotlights — delivered to your inbox every Friday.
        </p>

        {submitted ? (
          <p className="font-sans text-primary text-sm">Welcome to the mountain. Check your inbox for a confirmation.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-sm text-primary-foreground placeholder:text-primary-foreground/40 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium tracking-wide rounded-sm hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
