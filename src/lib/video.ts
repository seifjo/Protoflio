export type VideoEmbed =
  | { kind: "youtube"; id: string; src: string }
  | { kind: "vimeo"; id: string; src: string }
  | { kind: "file"; src: string };

export function parseVideoUrl(url?: string | null): VideoEmbed | null {
  if (!url) return null;
  const value = url.trim();
  if (!value) return null;

  const youtube =
    value.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
    ) || value.match(/youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{6,})/);
  if (youtube?.[1]) {
    return {
      kind: "youtube",
      id: youtube[1],
      src: `https://www.youtube.com/embed/${youtube[1]}`,
    };
  }

  const vimeo = value.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return {
      kind: "vimeo",
      id: vimeo[1],
      src: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(value) || value.startsWith("/uploads/")) {
    return { kind: "file", src: value };
  }

  return { kind: "file", src: value };
}
