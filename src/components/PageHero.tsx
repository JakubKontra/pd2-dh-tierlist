import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: ReactNode;
  note?: ReactNode;
}

export function PageHero({ title, subtitle, note }: Props) {
  return (
    <div className="text-center mb-6">
      <h1 className="heading-gold text-4xl sm:text-5xl lg:text-6xl leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-d2-unique text-sm sm:text-base mt-1 tracking-wide">
          {subtitle}
        </p>
      )}
      {note && (
        <p className="text-stone-500 text-xs mt-1 italic">{note}</p>
      )}
    </div>
  );
}
