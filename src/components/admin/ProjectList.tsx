"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { GripVertical, Pencil, Copy, Trash2, Eye } from "lucide-react";
import {
  deleteProjectAction,
  duplicateProjectAction,
  reorderProjectsAction,
  togglePublishAction,
} from "@/lib/actions/projects";
import { formatDateTime } from "@/lib/utils";
import { ClientOnly } from "./ClientOnly";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  published: boolean;
  updatedAt: Date;
  images: { url: string; isCover: boolean }[];
};

function ProjectRowCells({
  project,
  onRefresh,
  dragHandle,
}: {
  project: ProjectRow;
  onRefresh: () => void;
  dragHandle?: React.ReactNode;
}) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const cover =
    project.images.find((i) => i.isCover) ?? project.images[0] ?? null;

  return (
    <>
      <td className="px-3 py-3">{dragHandle ?? <span className="w-4" />}</td>
      <td className="px-3 py-3">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt="" className="h-10 w-14 object-cover" />
        ) : (
          <div className="h-10 w-14 bg-[var(--line)]" />
        )}
      </td>
      <td className="px-3 py-3">
        <p className="font-medium">{project.title}</p>
        <p className="text-xs text-[var(--dim)]">/{project.slug}</p>
      </td>
      <td className="px-3 py-3 text-sm text-[var(--muted)]">{project.status}</td>
      <td className="px-3 py-3">
        {project.featured ? (
          <span className="text-[10px] tracking-wider text-[var(--accent)] uppercase">
            Yes
          </span>
        ) : (
          <span className="text-[var(--dim)]">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        <button
          type="button"
          disabled={publishing}
          onClick={async () => {
            setPublishing(true);
            await togglePublishAction(project.id);
            router.refresh();
            onRefresh();
            setPublishing(false);
          }}
          className={`min-w-[88px] border px-2 py-1 text-[10px] tracking-wider uppercase transition-colors ${
            project.published
              ? "border-[var(--ok)] text-[var(--ok)] hover:bg-[var(--ok-soft)]"
              : "border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]"
          }`}
        >
          {publishing
            ? "…"
            : project.published
              ? "Published"
              : "Publish"}
        </button>
      </td>
      <td className="px-3 py-3 text-xs text-[var(--dim)]">
        {formatDateTime(project.updatedAt)}
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="text-[var(--muted)] hover:text-white"
            title="Edit"
          >
            <Pencil size={14} />
          </Link>
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="text-[var(--muted)] hover:text-white"
            title="Preview"
          >
            <Eye size={14} />
          </Link>
          <button
            type="button"
            onClick={() => duplicateProjectAction(project.id)}
            className="text-[var(--muted)] hover:text-white"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this project?")) return;
              await deleteProjectAction(project.id);
              onRefresh();
            }}
            className="text-[var(--danger)]"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </>
  );
}

function SortableRow({
  project,
  onRefresh,
}: {
  project: ProjectRow;
  onRefresh: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="border-b border-[var(--line)]"
    >
      <ProjectRowCells
        project={project}
        onRefresh={onRefresh}
        dragHandle={
          <button
            type="button"
            className="cursor-grab text-[var(--dim)]"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
        }
      />
    </tr>
  );
}

function StaticRow({
  project,
  onRefresh,
}: {
  project: ProjectRow;
  onRefresh: () => void;
}) {
  return (
    <tr className="border-b border-[var(--line)]">
      <ProjectRowCells project={project} onRefresh={onRefresh} />
    </tr>
  );
}

function TableHead() {
  return (
    <thead className="border-b border-[var(--line)] bg-[#0a0d14]">
      <tr>
        <th className="px-3 py-3" />
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Thumb
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Project
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Status
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Featured
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Published
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Updated
        </th>
        <th className="px-3 py-3 mono text-[10px] tracking-wider text-[var(--dim)] uppercase">
          Actions
        </th>
      </tr>
    </thead>
  );
}

function SortableProjectTable({
  items,
  onRefresh,
  onReorder,
}: {
  items: ProjectRow[];
  onRefresh: () => void;
  onReorder: (next: ProjectRow[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    onReorder(next);
    await reorderProjectsAction(next.map((i) => i.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <table className="w-full min-w-[800px] text-left text-sm">
        <TableHead />
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <tbody>
            {items.map((project) => (
              <SortableRow
                key={project.id}
                project={project}
                onRefresh={onRefresh}
              />
            ))}
          </tbody>
        </SortableContext>
      </table>
    </DndContext>
  );
}

function StaticProjectTable({
  items,
  onRefresh,
}: {
  items: ProjectRow[];
  onRefresh: () => void;
}) {
  return (
    <table className="w-full min-w-[800px] text-left text-sm">
      <TableHead />
      <tbody>
        {items.map((project) => (
          <StaticRow
            key={project.id}
            project={project}
            onRefresh={onRefresh}
          />
        ))}
      </tbody>
    </table>
  );
}

export function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const [items, setItems] = useState(projects);
  const router = useRouter();
  const onRefresh = () => router.refresh();

  return (
    <div className="overflow-x-auto border border-[var(--line)]">
      <ClientOnly
        fallback={<StaticProjectTable items={items} onRefresh={onRefresh} />}
      >
        <SortableProjectTable
          items={items}
          onRefresh={onRefresh}
          onReorder={setItems}
        />
      </ClientOnly>
    </div>
  );
}
