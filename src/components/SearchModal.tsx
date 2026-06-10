import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { altitudeLabels } from "@/data/articles";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const { results, searching, search, clear } = useSearch();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); clear(); }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-deep-brown/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl bg-background border border-border rounded-md shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, designers…"
            className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searching && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />}
          <button onClick={onClose} aria-label="Close search">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {results.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                onClick={onClose}
                className="flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors"
              >
                <img src={article.coverImage} alt={article.title}
                  className="w-12 h-12 object-cover rounded-sm shrink-0" />
                <div>
                  <p className="font-sans text-sm font-medium text-foreground line-clamp-1">
                    {article.title}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {altitudeLabels[article.altitude]} · {article.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length >= 2 && !searching && results.length === 0 && (
          <p className="font-sans text-sm text-muted-foreground text-center py-8">
            No results for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
