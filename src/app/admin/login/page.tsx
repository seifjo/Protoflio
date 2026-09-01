import { LoginForm } from "@/components/admin/LoginForm";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { from } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-[#07080c] px-5">
      <div className="w-full max-w-md border border-[var(--line)] bg-[#0a0d14] p-8">
        <p className="mono text-[11px] tracking-[0.2em] text-[var(--accent)] uppercase">
          Portfolio CMS
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Manage projects, media, and site content.
        </p>
        <div className="mt-8">
          <LoginForm from={from || "/admin"} />
        </div>
      </div>
    </div>
  );
}
