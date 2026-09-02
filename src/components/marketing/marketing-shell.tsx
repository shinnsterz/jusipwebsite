import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteNavbar } from "@/components/marketing/site-navbar";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-theme min-h-screen bg-[#070b13] text-[#f8f1df]">
      <SiteNavbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
