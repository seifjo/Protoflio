"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageItem = {
  id: string;
  url: string;
  caption: string;
  altText: string;
};

export function ScreenshotGallery({ images }: { images: ImageItem[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images.length) return null;
  const current = images[active] ?? images[0];

  function go(delta: number) {
    setActive((value) => (value + delta + images.length) % images.length);
  }

  return (
    <div>
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full overflow-hidden border border-[var(--line)] bg-[#0a0d14]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.altText || current.caption || "Project screenshot"}
            className="aspect-[16/10] w-full object-cover object-top"
          />
        </button>
        {images.length > 1 ? (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "overflow-hidden border",
                  index === active
                    ? "border-[var(--accent)]"
                    : "border-[var(--line)] opacity-70 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.altText || `Screenshot ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="md:hidden">
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setActive(index);
                setOpen(true);
              }}
              className="w-[86%] shrink-0 snap-center overflow-hidden border border-[var(--line)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.altText || image.caption || "Project screenshot"}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      </div>

      {current.caption ? (
        <p className="mono mt-3 text-[11px] tracking-[0.12em] text-[var(--dim)] uppercase">
          {current.caption}
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center border border-white/20 text-white"
            onClick={() => setOpen(false)}
            aria-label="Close lightbox"
          >
            <X size={18} />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 grid h-11 w-11 place-items-center border border-white/20 text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="absolute right-4 grid h-11 w-11 place-items-center border border-white/20 text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : null}
          <div
            className="max-h-[85vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].url}
              alt={images[active].altText || "Project screenshot"}
              className="max-h-[85vh] w-full object-contain"
            />
            {images[active].caption ? (
              <p className="mt-3 text-center text-sm text-white/70">
                {images[active].caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
