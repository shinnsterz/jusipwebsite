import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/partnerships")({
  head: () => ({
    meta: [
      { title: "Partnerships & Ads — Crew On Set! Admin" },
      { name: "description", content: "Review brand partnership applications and monitor active advertisements." },
    ],
  }),
  component: PartnershipsPage,
});

import { useMemo, useState } from "react";
import Link from "@/components/next-compat/link";
import {
  Banknote,
  BarChart3,
  CalendarClock,
  Eye,
  FileText,
  HandCoins,
  Link2,
  Mail,
  MailCheck,
  Megaphone,
  MousePointerClick,
  Wallet2,
  X,
} from "lucide-react";
import {
  adsStore,
  applicationsStore,
  formatMoney,
  type ActiveAd,
  type PartnershipApplication,
  type PartnershipStatus,
} from "@/lib/demo/store";

const statuses: PartnershipStatus[] = ["Pending", "Approved", "On-going", "Done", "Declined"];

const statusStyles: Record<PartnershipStatus, string> = {
  Pending: "bg-[#d9a514]/15 text-[#e1b42b]",
  Approved: "bg-[#2d9d8f]/15 text-[#4bc4b4]",
  "On-going": "bg-[#3a7bd5]/15 text-[#7cb0ee]",
  Done: "bg-white/[.08] text-white/50",
  Declined: "bg-coral/15 text-[#ff7663]",
};

const adStatusStyles: Record<ActiveAd["status"], string> = {
  "On-going": "bg-[#2d9d8f]/15 text-[#4bc4b4]",
  Expiring: "bg-[#d9a514]/15 text-[#e1b42b]",
  Expired: "bg-coral/15 text-[#ff7663]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PartnershipsPage() {
  const [applications, setApplications] = applicationsStore.useStore();
  const [selected, setSelected] = useState<PartnershipApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | PartnershipStatus>("All");
  const [emailConfirmation, setEmailConfirmation] = useState<string | null>(null);

  const [ads] = adsStore.useStore();
  const [adStatusFilter, setAdStatusFilter] = useState<"All" | ActiveAd["status"]>("All");

  const filtered = useMemo(
    () =>
      statusFilter === "All"
        ? applications
        : applications.filter((a) => a.status === statusFilter),
    [applications, statusFilter],
  );

  const filteredAds = useMemo(
    () => (adStatusFilter === "All" ? ads : ads.filter((a) => a.status === adStatusFilter)),
    [ads, adStatusFilter],
  );

  const adTotals = useMemo(
    () =>
      ads.reduce(
        (acc, ad) => ({
          revenue: acc.revenue + ad.revenue,
          clicks: acc.clicks + ad.clicks,
          visits: acc.visits + ad.visits,
        }),
        { revenue: 0, clicks: 0, visits: 0 },
      ),
    [ads],
  );

  const adSummaries = [
    { label: "Total Ad Revenue", value: formatMoney(adTotals.revenue), icon: Wallet2, color: "bg-[#d9a514] text-[#101923]" },
    { label: "Total Ad Clicks", value: adTotals.clicks.toLocaleString(), icon: MousePointerClick, color: "bg-coral text-white" },
    { label: "Total Visits", value: adTotals.visits.toLocaleString(), icon: BarChart3, color: "bg-[#243241] text-white" },
  ];

  const adStatusOptions: ("All" | ActiveAd["status"])[] = ["All", "On-going", "Expiring", "Expired"];

  function updateStatus(id: string, status: PartnershipStatus) {
    const next = applications.map((a) => (a.id === id ? { ...a, status } : a));
    setApplications(next);
    if (selected?.id === id) setSelected({ ...selected, status });

    const app = applications.find((a) => a.id === id);
    if (app) {
      setEmailConfirmation(`Automated status email sent to ${app.email} — status set to "${status}".`);
      window.setTimeout(() => setEmailConfirmation(null), 4500);
    }
  }

  return (
    <div className="admin-page h-full overflow-y-auto bg-[#101923] text-white">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[.18em] !text-coral">PARTNERSHIPS &amp; ADS</p>
        <h1 className="admin-heading mt-2 !text-white">Partnerships &amp; Ads</h1>
        <p className="admin-kicker !text-white/45">
          Review brand proposals and monitor live advertisements in one place.
        </p>
        <nav className="mt-4 flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-wide">
          <a href="#partnership-applications" className="rounded-md border border-white/10 px-3 py-1.5 !text-white/50 transition hover:border-coral hover:!text-white">
            Partnership Applications
          </a>
          <a href="#active-advertisements" className="rounded-md border border-white/10 px-3 py-1.5 !text-white/50 transition hover:border-coral hover:!text-white">
            Active Advertisements
          </a>
        </nav>
      </header>

      <section id="partnership-applications" className="scroll-mt-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-black uppercase !text-white">Partnership Applications</h2>
            <p className="mt-1 text-xs !text-white/45">
              Review brand proposals and manage their approval status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("All")}
              className={`rounded-md border px-3 py-2 text-[10px] font-black uppercase transition ${
                statusFilter === "All" ? "border-coral bg-coral text-white" : "border-white/10 text-white/50 hover:border-white/25"
              }`}
            >
              All
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md border px-3 py-2 text-[10px] font-black uppercase transition ${
                  statusFilter === s ? "border-coral bg-coral text-white" : "border-white/10 text-white/50 hover:border-white/25"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {emailConfirmation && (
          <div className="mb-5 flex items-center gap-3 rounded-md border border-[#4bc4b4]/25 bg-[#2d9d8f]/10 px-4 py-3 text-xs font-bold text-[#4bc4b4]">
            <MailCheck className="size-4 shrink-0" />
            {emailConfirmation}
          </div>
        )}

        <div className="admin-table-wrap overflow-hidden rounded-lg border border-white/[0.06] bg-[#182330] shadow-xl">
          <div className="admin-table-wrap overflow-x-auto">
            <table className="admin-table w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#141e29]">
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Brand</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Product Type</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Budget</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Submitted</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Status</th>
                  <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider !text-white/40">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-white/[0.05] transition hover:bg-white/[0.025] last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-black !text-white">{app.brand}</p>
                      <p className="text-[10px] !text-white/35">{app.id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm !text-white/55">{app.productType}</td>
                    <td className="px-5 py-4 text-sm font-bold !text-white/70">{formatMoney(app.budget)}</td>
                    <td className="px-5 py-4 text-sm !text-white/50">{formatDate(app.submittedAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2.5 py-1 text-[10px] font-black uppercase ${statusStyles[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(app)}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase text-white/60 transition hover:border-coral hover:text-white"
                      >
                        <Eye className="size-3.5" />
                        See Info
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm !text-white/35">
                      No applications match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="active-advertisements" className="mt-12 scroll-mt-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-black uppercase !text-white">Active Advertisements</h2>
            <p className="mt-1 text-xs !text-white/45">
              Track live in-game advertisements and their performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {adStatusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setAdStatusFilter(s)}
                className={`rounded-md border px-3 py-2 text-[10px] font-black uppercase transition ${
                  adStatusFilter === s ? "border-coral bg-coral text-white" : "border-white/10 text-white/50 hover:border-white/25"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {adSummaries.map((summary) => (
            <article key={summary.label} className="rounded-lg border border-white/[0.06] bg-[#182330] p-5 shadow-xl">
              <div className={`grid size-10 place-items-center rounded-md ${summary.color}`}>
                <summary.icon className="size-5" />
              </div>
              <p className="mt-5 text-3xl font-black tracking-tight !text-white">{summary.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider !text-white/35">{summary.label}</p>
            </article>
          ))}
        </div>

        <div className="admin-table-wrap mt-6 overflow-hidden rounded-lg border border-white/[0.06] bg-[#182330] shadow-xl">
          <div className="admin-table-wrap overflow-x-auto">
            <table className="admin-table w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#141e29]">
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Brand</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Exact Model</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Start Date</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Expiration Date</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Status</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider !text-white/40">Revenue</th>
                  <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider !text-white/40">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="border-b border-white/[0.05] transition hover:bg-white/[0.025] last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-black !text-white">{ad.brand}</p>
                      <p className="text-[10px] !text-white/35">{ad.id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm !text-white/55">{ad.exactModel}</td>
                    <td className="px-5 py-4 text-sm !text-white/50">{formatDate(ad.startDate)}</td>
                    <td className="px-5 py-4 text-sm !text-white/50">{formatDate(ad.expiresAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2.5 py-1 text-[10px] font-black uppercase ${adStatusStyles[ad.status]}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold !text-white/70">{formatMoney(ad.revenue)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/ads/${ad.id}`}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase text-white/60 transition hover:border-coral hover:text-white"
                      >
                        <Eye className="size-3.5" />
                        See Info
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredAds.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-sm !text-white/35">
                      <Megaphone className="mx-auto mb-3 size-7 !text-white/15" />
                      No ads match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/[.08] bg-[#151c28] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 bg-black/20 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-white/[.06] bg-[#0d121b] px-6 py-6">
              <p className="text-[10px] font-black uppercase tracking-[.2em] !text-coral">{selected.id}</p>
              <h2 className="mt-1 text-2xl font-black uppercase !text-white">{selected.brand}</h2>
              <span className={`mt-2 inline-block rounded px-2.5 py-1 text-[10px] font-black uppercase ${statusStyles[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <HandCoins className="size-3.5" /> Product Type
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">{selected.productType}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-black uppercase tracking-wide !text-white/30">Exact Model</dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">{selected.exactModel}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <Link2 className="size-3.5" /> Link
                  </dt>
                  <dd className="mt-1.5 break-all text-sm font-bold !text-[#7cb0ee]">
                    <a href={selected.link} target="_blank" rel="noreferrer">
                      {selected.link}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <FileText className="size-3.5" /> File
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">{selected.fileName}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <Mail className="size-3.5" /> Email
                  </dt>
                  <dd className="mt-1.5 break-all text-sm font-bold !text-white/80">{selected.email}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <Banknote className="size-3.5" /> Proposed Budget
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">{formatMoney(selected.budget)}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wide !text-white/30">
                    <CalendarClock className="size-3.5" /> Advertisement Duration
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">
                    {selected.duration} {selected.durationUnit}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] font-black uppercase tracking-wide !text-white/30">Submission Date</dt>
                  <dd className="mt-1.5 text-sm font-bold !text-white/80">{formatDate(selected.submittedAt)}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-white/[.06] pt-5">
                <p className="text-[9px] font-black uppercase tracking-wide !text-white/30">Update Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value as PartnershipStatus)}
                  className="admin-input mt-2 w-full rounded-md border px-3 py-2.5 text-sm font-bold outline-none focus:border-coral"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <p className="mt-3 text-[11px] leading-relaxed !text-white/40">
                  Changing this status automatically triggers a status-update email to the brand contact
                  (simulated in this demo environment) so they stay informed without manual follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
