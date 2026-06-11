import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureSpreadProps {
  image: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  dark?: boolean;
}

export function FeatureSpread({ image, label, title, body, href, cta, dark = false }: FeatureSpreadProps) {
  return (
    <Link
      to={href}
      className="group relative overflow-hidden flex items-end"
      style={{ minHeight: '560px' }}>
      <img src={image} alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        dark
          ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/20'
          : 'bg-gradient-to-t from-deep-brown/90 via-deep-brown/30 to-transparent'
      }`} />
      <div className="relative z-10 p-8 md:p-10 w-full">
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary block mb-2">
          {label}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight">
          {title}
        </h3>
        <p className="font-sans text-white/70 text-sm mt-2 mb-5 max-w-xs">
          {body}
        </p>
        <span className="inline-flex items-center gap-2 font-sans text-sm text-primary font-semibold group-hover:gap-3 transition-all">
          {cta} <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
