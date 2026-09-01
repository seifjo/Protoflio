import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { getSkills } from "@/lib/queries";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return <SkillsEditor skills={skills} />;
}
