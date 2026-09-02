import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bugs")({
  head: () => ({
    meta: [
      { title: "Bug Reports — Crew On Set! Admin" },
      { name: "description", content: "Triage and resolve player-submitted bug reports." },
      { property: "og:title", content: "Bug Reports — Crew On Set! Admin" },
      { property: "og:description", content: "Triage and resolve player-submitted bug reports." },
    ],
  }),
  component: BugReportsPage,
});

import { useMemo, useState } from "react";
import { Bug, Eye, Search, Trash2, X } from "lucide-react";
import {
  bugCategories,
  bugReportsStore,
  logAdminActivity,
  type BugReport,
  type BugStatus,
} from "@/lib/demo/store";

const statusOptions: BugStatus[] = ["New", "Investigating", "Resolved"];

const statusStyles: Record<BugStatus, string> = {
  New: "bg-coral/15 text-[#ff7663]",
  Investigating: "bg-[#d9a514]/15 text-[#e1b42b]",
  Resolved: "bg-[#2d9d8f]/15 text-[#4bc4b4]",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function BugReportsPage() {
  const [bugs, setBugs] = bugReportsStore.useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [viewBug, setViewBug] = useState<BugReport | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BugReport | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return bugs.filter((bug) => {
      const matchesSearch =
        !search ||
        `${bug.playerName} ${bug.playerId} ${bug.description} ${bug.id}`
          .toLowerCase()
          .includes(search);
      const matchesCategory = category === "All Categories" || bug.category === category;
      const matchesStatus = status === "All Statuses" || bug.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [bugs, query, category, status]);

  function updateStatus(bug: BugReport, next: BugStatus) {
    setBugs(bugs.map((b) => (b.id === bug.id ? { ...b, status: next } : b)));
    logAdminActivity({
      kind: "bug",
      label: "Bug report status updated",
      detail: `${bug.id} (${bug.playerName}) marked as ${next}.`,
    });
  }

  function deleteBug(bug: BugReport) {
    setBugs(bugs.filter((b) => b.id !== bug.id));
    logAdminActivity({
      kind: "bug",
      label: "Bug report deleted",
      detail: `${bug.id} (${bug.playerName}) was removed.`,
    });
    setDeleteTarget(null);
  }

  return (
    <div className="admin-page h-full overflow-y-auto bg-[#101923] text-white">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[.18em] !text-coral">SUPPORT</p>
        <h1 className="admin-heading mt-2 !text-white">Bug Reports</h1>
        <p className="admin-kicker !text-white/45">
          Review player-submitted issues and track triage status.
        </p>
      </header>

      {/* FILTERS */}
      <section className="admin-card mb-4 flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#182330] p-4 shadow-xl sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 !text-white/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by player, ID, or description"
            className="admin-input h-11 w-full rounded-md border border-white/10 bg-[#101923] pl-10 pr-3 text-sm font-bold !text-white outline-none transition placeholder:!text-white/25 focus:border-coral"
          />
        </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="admin-input h-11 rounded-md border border-white/10 bg-[#101923] px-3 text-sm font-bold !text-white outline-none focus:border-coral"
        >
          <option>All Categories</option>
          {bugCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="admin-input h-11 rounded-md border border-white/10 bg-[#101923] px-3 text-sm font-bold !text-white outline-none focus:border-coral"
        >
          <option>All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </section>

      {/* TABLE */}
      <section className="admin-table-wrap overflow-hidden rounded-lg border border-white/[0.06] bg-[#182330] shadow-xl">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[880px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#141e29]">
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Player</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Category</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Description</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Submitted</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Status</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bug) => (
                <tr key={bug.id} className="border-b border-white/[0.05] transition hover:bg-white/[0.025] last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-bold !text-white">{bug.playerName}</p>
                    <p className="mt-0.5 text-[10px] !text-white/30">{bug.playerId}</p>
                  </td>
                  <td className="px-5 py-4 text-sm !text-white/60">{bug.category}</td>
                  <td className="px-5 py-4 text-sm !text-white/50">
                    <p className="max-w-xs truncate">{bug.description}</p>
                  </td>
                  <td className="px-5 py-4 text-xs !text-white/40">{formatDate(bug.submittedAt)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={bug.status}
                      onChange={(event) => updateStatus(bug, event.target.value as BugStatus)}
                      className={`rounded px-2.5 py-1.5 text-[10px] font-black uppercase outline-none ${statusStyles[bug.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-[#101923] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewBug(bug)}
                        title="View details"
                        aria-label="View details"
                        className="grid size-8 place-items-center rounded-md border border-white/10 !text-white/60 transition hover:border-coral hover:!text-white"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(bug)}
                        title="Delete report"
                        aria-label="Delete report"
                        className="grid size-8 place-items-center rounded-md border border-white/10 !text-white/60 transition hover:border-coral hover:!text-coral"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Bug className="mx-auto size-8 !text-white/20" />
                    <p className="mt-2 text-sm font-bold !text-white/40">No bug reports found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* VIEW DETAILS MODAL */}
      {viewBug && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setViewBug(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#151c28] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-black uppercase text-white">{viewBug.id}</h3>
              <button onClick={() => setViewBug(null)} className="!text-white/40 hover:!text-white">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-3 text-xs font-black uppercase tracking-wide !text-white/35">Player</p>
            <p className="text-sm !text-white/80">{viewBug.playerName} ({viewBug.playerId})</p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide !text-white/35">Category</p>
            <p className="text-sm !text-white/80">{viewBug.category}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide !text-white/35">Submitted</p>
            <p className="text-sm !text-white/80">{formatDate(viewBug.submittedAt)}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-wide !text-white/35">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm !text-white/70">{viewBug.description}</p>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-[#ff6248]/40 bg-[#151c28] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-black uppercase text-white">Delete Bug Report?</h3>
            <p className="mt-3 text-sm text-white/50">
              This permanently removes {deleteTarget.id} from the queue. This action cannot be undone in this demo session.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-xs font-bold text-white/60 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBug(deleteTarget)}
                className="rounded-md bg-[#ff6248] px-4 py-2 text-xs font-black uppercase text-white transition hover:bg-[#e5533b]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
