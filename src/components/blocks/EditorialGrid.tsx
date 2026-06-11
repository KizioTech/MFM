import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import { AltitudePill } from "@/components/AltitudePill";
import type { Article } from "@/data/articles";

export function EditorialGrid({ articles }: { articles: Article[] }) {
  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const scan = rest.slice(2, 5);

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12">

      {/* Section label */}
      <div className="max-w-[1600px] mx-auto flex items-center gap-4 mb-10">
        <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-primary font-semibold">
          Latest Editorials
        </span>
        <div className="flex-1 h-px bg-border" />
        <Link to="/archives/peak" className="font-sans text-xs text-muted-foreground hover:text-primary transition-colors">
          View all →
        </Link>
      </div>

      {/* Main grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border">

        {/* Featured — takes 2 columns, full height */}
        {featured && (
          <Link
            to={`/article/${featured.slug}`}
            className="lg:col-span-2 relative overflow-hidden group block border-b lg:border-b-0 lg:border-r border-border"
            style={{ minHeight: "580px" }}
          >
            <LazyImage
              src={featured.coverImage}
              alt={featured.title}
              width={800}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/95 via-deep-brown/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <AltitudePill altitude={featured.altitude} />
              <h2 className="font-serif text-3xl md:text-4xl xl:text-[42px] text-white mt-3 mb-3 leading-tight max-w-xl">
                {featured.title}
              </h2>
              <p className="font-sans text-white/65 text-sm max-w-md line-clamp-2 mb-5">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-white/55 text-xs font-sans">
                <span>By {featured.author}</span>
                <span>·</span>
                <span>
                  {new Date(featured.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary stack — 1 column, split horizontally */}
        <div className="flex flex-col">
          {secondary.map((article, i) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className={`relative overflow-hidden group flex-1 block ${
                i === 0 ? "border-b border-border" : ""
              }`}
              style={{ minHeight: "290px" }}
            >
              <LazyImage
                src={article.coverImage}
                alt={article.title}
                width={400}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/90 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <AltitudePill altitude={article.altitude} small />
                <h3 className="font-serif text-xl md:text-2xl text-white mt-2 leading-tight line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Horizontal scan strip */}
      {scan.length > 0 && (
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-3 border-x border-b border-border">
          {scan.map((article, i) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className={`group flex gap-5 p-6 hover:bg-muted/40 transition-colors ${
                i < scan.length - 1 ? "border-b sm:border-b-0 sm:border-r border-border" : ""
              }`}
            >
              <div className="w-20 h-20 shrink-0 overflow-hidden rounded-sm relative">
                <LazyImage
                  src={article.coverImage}
                  alt={article.title}
                  aspectRatio="square"
                  width={200}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <AltitudePill altitude={article.altitude} tiny />
                <h4 className="font-serif text-[15px] text-foreground group-hover:text-primary transition-colors mt-1.5 line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <p className="font-sans text-xs text-muted-foreground mt-1.5">{article.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
