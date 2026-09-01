import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.project.updateMany({
    data: { published: true },
  });
  console.log(`Published ${result.count} projects.`);
}

main().finally(() => prisma.$disconnect());
