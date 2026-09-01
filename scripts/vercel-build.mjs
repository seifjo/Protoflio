import { execSync } from "node:child_process";

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error(`
╔══════════════════════════════════════════════════════════════╗
║  BUILD FAILED: DATABASE_URL is not set on Vercel           ║
╠══════════════════════════════════════════════════════════════╣
║  1. Create a free database at https://neon.tech            ║
║  2. Copy the PostgreSQL connection string                    ║
║  3. In Vercel → Project → Settings → Environment Variables   ║
║     Add: DATABASE_URL = your connection string               ║
║  4. Also add: AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD     ║
║  5. Redeploy                                                 ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

run("npx prisma generate");
run("npx prisma db push --accept-data-loss");
run("npx tsx prisma/seed.ts");
run("npx next build");
