import { markMessageReadAction, deleteMessageAction } from "@/lib/actions/settings";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Contact form submissions from the public site.
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-[var(--dim)]">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border p-5 ${
                msg.read
                  ? "border-[var(--line)] opacity-70"
                  : "border-[var(--accent)] bg-[var(--accent-soft)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{msg.name}</p>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-[var(--accent)]"
                  >
                    {msg.email}
                  </a>
                  <p className="mt-1 text-xs text-[var(--dim)]">
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await markMessageReadAction(msg.id, !msg.read);
                    }}
                  >
                    <button
                      type="submit"
                      className="border border-[var(--line)] px-3 py-1 text-[10px] tracking-wider uppercase"
                    >
                      {msg.read ? "Mark unread" : "Mark read"}
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteMessageAction(msg.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-1 text-[10px] tracking-wider text-[var(--danger)] uppercase"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--muted)]">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
