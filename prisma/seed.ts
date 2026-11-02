import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const ABOUT_TEXT = `I build cross-platform applications with Flutter, focusing on clean architecture, backend integration and practical user experiences.

I work across mobile product development — from local-first databases and REST APIs to Firebase and Supabase backends — and I care about shipping software that is structured, maintainable, and useful.`;

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@localhost";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.ADMIN_NAME || "Seif Kamel";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: await hash(password, 12),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Seif Kamel",
      jobTitle: "Flutter Developer",
      bio: "Flutter developer building mobile and cross-platform applications.",
      availability: "Available for work",
      available: true,
      email: "Seifjo223@gmail.com",
      heroLabel: "flutter build • live",
      heroName: "SEIF KAMEL",
      heroRole: "FLUTTER DEVELOPER",
      heroSubtitle: "MOBILE & CROSS-PLATFORM DEVELOPER",
      heroMeta: "FREELANCE • REMOTE • HYBRID",
      aboutText: ABOUT_TEXT,
      footerText: "Seif Kamel — Flutter Developer",
      profileImage: "/profile/seif-kamel.webp",
      ogImage: "/profile/seif-kamel.webp",
      seoTitle: "Seif Kamel — Flutter Developer",
      seoDescription:
        "Portfolio of Seif Kamel, a Flutter developer building mobile and cross-platform applications.",
    },
  });

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      profileImage: "/profile/seif-kamel.webp",
      ogImage: "/profile/seif-kamel.webp",
      email: "Seifjo223@gmail.com",
    },
  });

  const skills: { name: string; category: string; sortOrder: number }[] = [
    { name: "Flutter", category: "Mobile", sortOrder: 0 },
    { name: "Dart", category: "Mobile", sortOrder: 1 },
    { name: "JavaScript", category: "Frontend", sortOrder: 0 },
    { name: "HTML", category: "Frontend", sortOrder: 1 },
    { name: "CSS", category: "Frontend", sortOrder: 2 },
    { name: "Firebase", category: "Backend", sortOrder: 0 },
    { name: "Supabase", category: "Backend", sortOrder: 1 },
    { name: "REST API", category: "Backend", sortOrder: 2 },
    { name: "SQLite", category: "Database", sortOrder: 0 },
    { name: "Drift", category: "Database", sortOrder: 1 },
    { name: "Git", category: "Tools", sortOrder: 0 },
    { name: "GitHub", category: "Tools", sortOrder: 1 },
  ];

  if ((await prisma.skill.count()) === 0) {
    await prisma.skill.createMany({ data: skills });
  }

  const existing = await prisma.project.findMany({ select: { slug: true } });
  const slugs = new Set(existing.map((p) => p.slug));

  const restaurantFeatures = [
    "Cashier Dashboard",
    "Kitchen Dashboard",
    "Manager Dashboard",
    "Owner Dashboard",
    "Rider App",
    "Order Management",
    "Table Management",
    "Staff Permissions",
    "Realtime Updates",
    "Offline Database",
    "Backup System",
  ];

  const restaurantTech = ["Flutter", "Supabase", "SQLite", "Drift", "REST API"];

  if (!slugs.has("restaurant-management-system")) {
    await prisma.project.create({
      data: {
        title: "Restaurant Management System",
        slug: "restaurant-management-system",
        shortDescription: "Complete restaurant management ecosystem.",
        category: "Mobile Application",
        status: "in-progress",
        role: "Flutter Developer",
        featured: true,
        published: true,
        sortOrder: 0,
        overview: "Complete restaurant management ecosystem.",
        seoTitle: "Restaurant Management System — Seif Kamel",
        seoDescription: "Complete restaurant management ecosystem built with Flutter.",
        features: {
          create: restaurantFeatures.map((title, sortOrder) => ({
            title,
            sortOrder,
          })),
        },
        technologies: {
          create: restaurantTech.map((name, sortOrder) => ({ name, sortOrder })),
        },
      },
    });
  }

  const drafts = [
    { title: "BiteGo", slug: "bitego", sortOrder: 1 },
    { title: "Clinic App", slug: "clinic-app", sortOrder: 2 },
    { title: "Robot Control App", slug: "robot-control-app", sortOrder: 3 },
    { title: "Expense Tracker", slug: "expense-tracker", sortOrder: 4 },
  ];

  for (const item of drafts) {
    if (slugs.has(item.slug)) continue;
    await prisma.project.create({
      data: {
        ...item,
        shortDescription: "",
        featured: false,
        published: false,
        status: "draft",
        seoTitle: `${item.title} — Seif Kamel`,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
