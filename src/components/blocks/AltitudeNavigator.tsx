import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { altitudeLabels, altitudeDescriptions, type AltitudeCategory } from '@/data/articles';

const ALTITUDES = ['peak', 'plateau', 'foothills', 'heritage'] as const;

export function AltitudeNavigator({ previewImages }: { previewImages: Record<string, string> }) {
  const [active, setActive] = useState<AltitudeCategory>('peak');

  return (
    <section className="bg-deep-brown py-24 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — tabs + descriptions */}
        <div>
          <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary/80 block mb-6">
            Choose Your Altitude
          </span>
          <div className="space-y-1">
            {ALTITUDES.map(alt => (
              <button key={alt} onClick={() => setActive(alt)}
                className={`w-full text-left group transition-all duration-200 ${
                  active === alt
                    ? 'border-l-2 border-primary pl-6 py-5'
                    : 'border-l-2 border-white/10 pl-6 py-4 hover:border-white/30'
                }`}>
                <span className={`font-serif text-xl md:text-2xl font-bold transition-colors ${
                  active === alt ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {altitudeLabels[alt]}
                </span>
                {active === alt && (
                  <p className="font-sans text-sm text-white/60 mt-1 animate-fade-up">
                    {altitudeDescriptions[alt]}
                  </p>
                )}
              </button>
            ))}
          </div>
          <Link to={`/archives/${active}`}
            className="inline-flex items-center gap-2 mt-8 font-sans text-sm text-primary font-medium hover:gap-3 transition-all">
            Enter {altitudeLabels[active]} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right — preview image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black/20">
          {ALTITUDES.map(alt => (
            <div key={alt}
              className={`absolute inset-0 transition-opacity duration-500 ${
                active === alt ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
              <img src={previewImages[alt]} alt={altitudeLabels[alt]}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 to-transparent" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
