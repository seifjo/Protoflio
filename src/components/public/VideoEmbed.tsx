import { parseVideoUrl } from "@/lib/video";

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.kind === "file") {
    return (
      <video
        className="aspect-video w-full border border-[var(--line)] bg-black"
        src={parsed.src}
        controls
        playsInline
      />
    );
  }

  return (
    <div className="aspect-video overflow-hidden border border-[var(--line)] bg-black">
      <iframe
        src={parsed.src}
        title={title || "Project demo"}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
