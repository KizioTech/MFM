import { altitudeLabels, type AltitudeCategory } from "@/data/articles";
import { cn } from "@/lib/utils";

interface AltitudePillProps {
  altitude: AltitudeCategory;
  small?: boolean;
  tiny?: boolean;
}

export function AltitudePill({ altitude, small = false, tiny = false }: AltitudePillProps) {
  return (
    <span
      className={cn(
        "inline-block font-sans font-medium tracking-widest uppercase text-primary-foreground bg-primary/90",
        tiny ? "px-1.5 py-0.5 text-[8px]" : small ? "px-2 py-1 text-[10px]" : "px-3 py-1 text-xs mb-4"
      )}
    >
      {altitudeLabels[altitude]}
    </span>
  );
}
