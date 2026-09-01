"use client";

import { useState } from "react";
import { deleteSkillAction, saveSkillAction } from "@/lib/actions/settings";
import { SKILL_CATEGORIES } from "@/lib/types";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
  sortOrder: number;
};

export function SkillsEditor({ skills }: { skills: Skill[] }) {
  const [items, setItems] = useState(skills);
  const [draft, setDraft] = useState({
    name: "",
    category: "Mobile",
    icon: "",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Skills</h1>
      <div className="flex flex-wrap gap-2">
        <input
          className="admin-input"
          placeholder="Skill name"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        />
        <select
          className="admin-input w-36"
          value={draft.category}
          onChange={(e) =>
            setDraft((d) => ({ ...d, category: e.target.value }))
          }
        >
          {SKILL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="admin-input w-24"
          placeholder="Icon"
          value={draft.icon}
          onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
        />
        <button
          type="button"
          className="bg-[var(--accent)] px-4 text-xs tracking-wider text-white uppercase"
          onClick={async () => {
            if (!draft.name.trim()) return;
            await saveSkillAction({
              name: draft.name,
              category: draft.category,
              icon: draft.icon,
              sortOrder: items.length,
            });
            window.location.reload();
          }}
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between border border-[var(--line)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{skill.name}</p>
              <p className="text-xs text-[var(--dim)]">{skill.category}</p>
            </div>
            <button
              type="button"
              className="text-xs text-[var(--danger)] uppercase"
              onClick={async () => {
                await deleteSkillAction(skill.id);
                setItems((prev) => prev.filter((s) => s.id !== skill.id));
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
