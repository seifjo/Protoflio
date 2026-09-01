import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { prisma } from "@/lib/prisma";
import { projectInclude } from "@/lib/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project) notFound();

  return <ProjectEditor project={project} />;
}
