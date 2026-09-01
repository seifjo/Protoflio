import fs from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";
import { fileSizeFromBytes } from "./utils";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const PDF_TYPES = new Set(["application/pdf"]);
const APK_TYPES = new Set([
  "application/vnd.android.package-archive",
  "application/octet-stream",
]);

const LIMITS = {
  image: 10 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
  apk: 80 * 1024 * 1024,
  other: 25 * 1024 * 1024,
};

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function publicUrl(relative: string) {
  return `/uploads/${relative.replace(/\\/g, "/")}`;
}

export function diskPathFromUrl(url: string) {
  if (!url.startsWith("/uploads/")) return null;
  const relative = url.replace(/^\/uploads\//, "");
  const resolved = path.join(UPLOAD_ROOT, relative);
  if (!resolved.startsWith(UPLOAD_ROOT)) return null;
  return resolved;
}

async function storeBuffer(
  key: string,
  buffer: Buffer,
  contentType: string,
  localRelative: string,
) {
  if (useBlob) {
    const blob = await put(key, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.dirname(path.join(UPLOAD_ROOT, localRelative));
  await ensureDir(dir);
  await fs.writeFile(path.join(UPLOAD_ROOT, localRelative), buffer);
  return publicUrl(localRelative);
}

export async function saveImage(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP, GIF, or AVIF.");
  }
  if (file.size > LIMITS.image) {
    throw new Error("Image is too large. Maximum size is 10MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const isGif = file.type === "image/gif";

  if (isGif) {
    const filename = `${id}-${safeName(file.name) || "image.gif"}`;
    const meta = await sharp(bytes, { animated: true }).metadata();
    const url = await storeBuffer(
      `images/${filename}`,
      bytes,
      file.type,
      `images/${filename}`,
    );
    return {
      url,
      width: meta.width ?? null,
      height: meta.height ?? null,
    };
  }

  const image = sharp(bytes).rotate();
  const meta = await image.metadata();
  const width = meta.width && meta.width > 1920 ? 1920 : meta.width;
  const processed = await image
    .resize({ width: width ?? 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const outMeta = await sharp(processed).metadata();
  const filename = `${id}.webp`;
  const url = await storeBuffer(
    `images/${filename}`,
    processed,
    "image/webp",
    `images/${filename}`,
  );

  return {
    url,
    width: outMeta.width ?? null,
    height: outMeta.height ?? null,
  };
}

export async function saveAsset(file: File, kind: "apk" | "pdf" | "other") {
  const limit = LIMITS[kind];
  if (file.size > limit) {
    throw new Error(`File is too large. Maximum size is ${fileSizeFromBytes(limit)}.`);
  }

  if (kind === "pdf" && !PDF_TYPES.has(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please upload a PDF file.");
  }
  if (
    kind === "apk" &&
    !APK_TYPES.has(file.type) &&
    !file.name.toLowerCase().endsWith(".apk")
  ) {
    throw new Error("Please upload an APK file.");
  }

  const folder = kind === "apk" ? "apk" : kind === "pdf" ? "pdf" : "files";
  const filename = `${Date.now()}-${safeName(file.name) || "file"}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const localRelative = `${folder}/${filename}`;
  const url = await storeBuffer(
    localRelative,
    bytes,
    file.type || "application/octet-stream",
    localRelative,
  );

  return {
    url,
    fileName: file.name,
    fileSize: fileSizeFromBytes(file.size),
  };
}

export async function deleteStoredFile(url?: string | null) {
  if (!url) return;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (useBlob) {
      try {
        await del(url);
      } catch {
        // File may already be gone.
      }
    }
    return;
  }

  const diskPath = diskPathFromUrl(url);
  if (!diskPath) return;
  try {
    await fs.unlink(diskPath);
  } catch {
    // File may already be gone.
  }
}
