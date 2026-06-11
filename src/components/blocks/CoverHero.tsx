import { Link } from "react-router-dom";

interface CoverHeroProps {
  latestSlug: string | null;
}

export function CoverHero({ latestSlug }: CoverHeroProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100dvh", minHeight: "600px" }}>
      {/* Video */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/fashion.mp4"
      />

      {/* Vignette overlay — weighted toward bottom + all-edge darkening */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center,
              transparent 25%,
              rgba(20,13,8,0.55) 100%
            ),
            linear-gradient(to top, rgba(20,13,8,0.92) 0%, rgba(20,13,8,0.3) 40%, transparent 65%)
          `,
        }}
      />

      {/* Issue label + headline + CTAs — bottom left */}
      <div className="absolute bottom-14 left-8 md:left-14 z-10 max-w-xl">
        <span className="font-sans text-xs tracking-[0.35em] uppercase text-ochre mb-4 block">
          Current Issue
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[82px] text-white leading-[1.0] font-bold">
          Malawian<br />
          <em className="not-italic font-serif italic">Heritage</em> Meets<br />
          Modern Fashion
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Link
            to={latestSlug ? `/article/${latestSlug}` : "/archives/peak"}
            className="px-7 py-3.5 bg-ochre text-white font-sans text-sm font-semibold tracking-wide hover:bg-ochre/90 transition-colors"
          >
            Read the Issue
          </Link>
          <Link
            to="/designers"
            className="px-7 py-3.5 border border-white/30 text-white font-sans text-sm font-semibold tracking-wide hover:border-white/70 hover:bg-white/5 transition-all backdrop-blur-sm"
          >
            Meet the Designers
          </Link>
        </div>
      </div>

      {/* Issue count — bottom right */}
      <div className="absolute bottom-14 right-8 md:right-14 z-10 text-right hidden sm:block">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/30">
          Mountain Fashion
        </p>
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/30">
          Magazine
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        <span className="font-sans text-[9px] tracking-[0.35em] text-white/30 uppercase">
          Scroll
        </span>
      </div>

      {/* Ochre fold line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-ochre/30 z-10" />
    </section>
  );
}
