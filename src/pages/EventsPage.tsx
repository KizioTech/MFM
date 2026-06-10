import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import DiscoverEmptyState from "@/components/DiscoverEmptyState";

const EventsPage = () => {
  const { events, loading } = useEvents();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">Discover</span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">Events</h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Fashion shows, pop-up markets and trunk shows across Malawi.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <DiscoverEmptyState
            title="Events Coming Soon"
            subtitle="Fashion shows, pop-up markets and trunk shows across Malawi will be listed here. Stay tuned for upcoming events."
            ctaLabel="Back to Home"
            ctaHref="/"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <div key={ev.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <EventCard event={ev} />
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default EventsPage;
