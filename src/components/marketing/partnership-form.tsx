import { FormEvent, useState } from "react";
import { CheckCircle2, FileImage, Send } from "lucide-react";

import { applicationsStore, uid, type PartnershipApplication } from "@/lib/demo/store";

export function PartnershipForm() {
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const productType = String(data.get("productType") ?? "");
    const exactModel = String(data.get("exactModel") ?? "").trim();
    const link = String(data.get("link") ?? "").trim();
    const budget = Number(data.get("budget"));
    const duration = Number(data.get("duration"));
    const durationUnit = String(data.get("durationUnit") ?? "Days") as "Days" | "Months";
    const email = String(data.get("email") ?? "").trim();

    if (!productType || !exactModel || !email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Please enter a valid proposed budget.");
      return;
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      setError("Please enter a valid advertisement duration.");
      return;
    }

    setError("");

    const application: PartnershipApplication = {
      id: uid("APP"),
      brand: exactModel,
      productType,
      exactModel,
      link,
      fileName: file?.name ?? "",
      budget,
      duration,
      durationUnit,
      email,
      submittedAt: new Date().toISOString(),
      status: "Pending",
    };

    applicationsStore.set([application, ...applicationsStore.get()]);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-xl shadow-navy/5">
        <CheckCircle2 className="mx-auto size-12 text-[#278b78]" />
        <h2 className="mt-4 text-2xl font-black uppercase">Application submitted</h2>
        <p className="mt-3 leading-relaxed text-navy/60">
          Thanks for applying to bring your brand onto the set. Your
          application status is now <strong>Pending</strong> and our
          production team will review it shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-navy/15 px-5 py-3 text-sm font-black uppercase tracking-wide text-navy transition hover:bg-navy/5"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy/10 bg-white p-5 shadow-xl shadow-navy/5 sm:p-8">
      <div className="flex items-center justify-between border-b border-navy/10 pb-5">
        <div>
          <p className="text-xs font-black tracking-[.16em] text-coral">PARTNERSHIP APPLICATION</p>
          <h2 className="mt-2 text-2xl font-black uppercase">Brand Partnership</h2>
        </div>
        <span className="hidden rounded bg-navy px-3 py-1.5 text-[10px] font-black tracking-wider text-yellow sm:block">B2B INQUIRY</span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="form-label">
          PRODUCT TYPE
          <select className="form-input" name="productType" required defaultValue="">
            <option value="" disabled>Select a product type</option>
            <option>Food & Beverage</option>
            <option>Technology</option>
            <option>Entertainment</option>
            <option>Fashion & Lifestyle</option>
            <option>Automotive</option>
            <option>Camera Gear</option>
            <option>Other</option>
          </select>
        </label>

        <label className="form-label">
          EXACT MODEL
          <input className="form-input" name="exactModel" required placeholder="Product name and model" />
        </label>

        <label className="form-label">
          LINK
          <input className="form-input" name="link" type="url" placeholder="https://www.yourbrand.com/product" />
        </label>

        <label className="form-label">
          BUSINESS EMAIL
          <input className="form-input" name="email" type="email" required placeholder="you@company.com" />
        </label>

        <label className="form-label">
          PROPOSED BUDGET (USD)
          <input className="form-input" name="budget" type="number" min={1} step={1} required placeholder="10000" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="form-label">
            AD DURATION
            <input className="form-input" name="duration" type="number" min={1} step={1} required placeholder="30" />
          </label>
          <label className="form-label">
            UNIT
            <select className="form-input" name="durationUnit" defaultValue="Days">
              <option>Days</option>
              <option>Months</option>
            </select>
          </label>
        </div>

        <label className="form-label sm:col-span-2">
          FILE ATTACHMENT
          <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-navy/15 bg-navy/[.025] px-4 py-4 text-sm transition hover:border-coral hover:bg-coral/[.03]">
            <FileImage className="size-5 shrink-0 text-coral" />
            <span className="min-w-0 flex-1 truncate font-bold">
              {file ? file.name : "Choose a file (image, PDF, or ZIP)"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf,.zip"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </span>
        </label>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-bold text-coral">{error}</p>}

      <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#278b78] px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#278b78]/20 transition hover:-translate-y-0.5 hover:bg-[#1f7464]">
        <Send className="size-5" /> Submit Partnership Application
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-navy/45">No account is required. Every partnership application is reviewed by our production team.</p>
    </form>
  );
}
