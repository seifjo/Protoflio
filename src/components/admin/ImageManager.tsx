"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2 } from "lucide-react";
import {
  addProjectImageAction,
  deleteProjectImageAction,
  reorderProjectImagesAction,
  updateProjectImageAction,
} from "@/lib/actions/projects";
import { FileUpload } from "./FileUpload";
import { ClientOnly } from "./ClientOnly";

type ImageItem = {
  id: string;
  url: string;
  caption: string;
  altText: string;
  isCover: boolean;
  sortOrder: number;
};

function SortableImage({
  image,
  onUpdate,
  onDelete,
}: {
  image: ImageItem;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex gap-3 border border-[var(--line)] bg-[#0a0d14] p-3"
    >
      <button
        type="button"
        className="mt-1 cursor-grab text-[var(--dim)]"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.altText || "Screenshot"}
        className="h-20 w-28 shrink-0 object-cover"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <input
          defaultValue={image.altText}
          placeholder="Alt text"
          className="admin-input text-xs"
          onBlur={async (e) => {
            await updateProjectImageAction(image.id, { altText: e.target.value });
            onUpdate();
          }}
        />
        <input
          defaultValue={image.caption}
          placeholder="Caption"
          className="admin-input text-xs"
          onBlur={async (e) => {
            await updateProjectImageAction(image.id, { caption: e.target.value });
            onUpdate();
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              await updateProjectImageAction(image.id, { isCover: true });
              onUpdate();
            }}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] tracking-wider uppercase ${
              image.isCover
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--line)] text-[var(--dim)]"
            }`}
          >
            <Star size={10} /> Cover
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this image?")) return;
              await deleteProjectImageAction(image.id);
              onDelete();
            }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] tracking-wider text-[var(--danger)] uppercase"
          >
            <Trash2 size={10} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageManager({
  projectId,
  images: initial,
}: {
  projectId: string;
  images: ImageItem[];
}) {
  const [images, setImages] = useState(initial);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const next = arrayMove(images, oldIndex, newIndex);
    setImages(next);
    await reorderProjectImagesAction(
      projectId,
      next.map((i) => i.id),
    );
  }

  return (
    <div className="space-y-4">
      <FileUpload
        kind="image"
        multiple
        accept="image/*"
        label="Upload screenshots"
        onUploaded={async (result) => {
          const res = await addProjectImageAction(projectId, result);
          if (res.image) {
            setImages((prev) => [...prev, res.image as ImageItem]);
          }
        }}
      />
      {images.length > 0 ? (
        <ClientOnly
          fallback={
            <div className="space-y-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex gap-3 border border-[var(--line)] bg-[#0a0d14] p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.altText || "Screenshot"}
                    className="h-20 w-28 shrink-0 object-cover"
                  />
                  <p className="text-sm text-[var(--muted)]">
                    {image.caption || image.altText || "Screenshot"}
                  </p>
                </div>
              ))}
            </div>
          }
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onUpdate={() => window.location.reload()}
                    onDelete={() =>
                      setImages((prev) => prev.filter((i) => i.id !== image.id))
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ClientOnly>
      ) : (
        <p className="text-sm text-[var(--dim)]">No images yet.</p>
      )}
    </div>
  );
}