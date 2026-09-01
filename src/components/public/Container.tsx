import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionLabel({
  index,
  label,
}: {
  index?: string;
  label: string;
}) {
  return (
    <p className="section-kicker mb-4">
      {index ? `${index} / ${label}` : label}
    </p>
  );
}
