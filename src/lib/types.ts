import type { Prisma } from "@prisma/client";
import { projectInclude } from "./queries";

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

export const SKILL_CATEGORIES = [
  "Mobile",
  "Frontend",
  "Backend",
  "Database",
  "Tools",
] as const;

export const PROJECT_STATUSES = [
  "draft",
  "in-progress",
  "completed",
  "archived",
] as const;

export const SOCIAL_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "WhatsApp",
  "X",
  "Instagram",
  "Dribbble",
  "Behance",
  "Website",
  "Other",
] as const;
