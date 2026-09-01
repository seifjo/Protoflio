import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-lg text-center">
        <p className="mono text-[12px] tracking-[0.2em] text-[var(--accent)] uppercase">
          404 / Not found
        </p>
        <h1 className="display mt-4 text-5xl">This page isn’t on the map.</h1>
        <p className="mt-4 text-[var(--muted)]">
          The route doesn’t exist, or the project hasn’t been published yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center border border-[var(--line)] px-5 text-sm tracking-[0.14em] uppercase"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
