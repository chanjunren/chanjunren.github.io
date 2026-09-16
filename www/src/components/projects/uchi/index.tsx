import CustomTag from "@site/src/components/ui/custom-tag";
import SimpleCard from "@site/src/components/ui/simple-card";
import { GalleryProjectInfo } from "@site/src/types";
import { BookOpenText, LockKeyhole, PanelLeft, WalletCards } from "lucide-react";
import { ReactNode } from "react";

function UchiDescription() {
  return (
    <div className="flex flex-col gap-5">
      <span>
        Uchi is a private workspace for local tools and personal projects.
      </span>
    </div>
  );
}

function LockedTag() {
  return (
    <CustomTag color="rose" className="absolute right-3 top-3 z-10 text-xs!">
      PRIVATE
    </CustomTag>
  );
}

function HomeCard() {
  return (
    <SimpleCard className="relative cursor-not-allowed overflow-hidden rounded-lg border border-(--ifm-color-emphasis-200) bg-[#f8f7f6]!">
      <LockedTag />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(180,99,122,0.14),transparent_34%),linear-gradient(135deg,rgba(40,105,131,0.09),transparent_45%)]" />
      <div className="absolute bottom-0 left-1/2 h-[150px] w-[142px] -translate-x-1/2 rounded-t-[72px] border border-[#b4637a]/45 bg-[#fffaf3]/70 shadow-[0_-18px_60px_rgba(180,99,122,0.12)]">
        <div className="absolute bottom-0 left-1/2 h-[114px] w-[92px] -translate-x-1/2 rounded-t-[48px] bg-[#b4637a]/16" />
        <div className="absolute left-1/2 top-16 h-2 w-2 -translate-x-9 rounded-full bg-[#b4637a]/70" />
      </div>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-normal text-[#575279]/70">
            local entrance
          </span>
          <CustomTag color="rose" className="text-3xl! font-semibold">
            うち
          </CustomTag>
        </div>
        <LockKeyhole
          aria-hidden="true"
          className="mb-1 h-6 w-6 text-[#b4637a]"
          strokeWidth={1.7}
        />
      </div>
    </SimpleCard>
  );
}

function ToolTile({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-0 flex-col justify-between rounded-md border border-[#575279]/12 bg-white/58 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-normal text-[#575279]/65">
          {label}
        </span>
        {icon}
      </div>
      {children}
    </div>
  );
}

function DashboardCard() {
  return (
    <SimpleCard className="relative cursor-not-allowed overflow-hidden rounded-lg border border-(--ifm-color-emphasis-200) bg-[#f8f7f6]! p-4">
      <LockedTag />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(86,148,159,0.12),transparent_44%),radial-gradient(circle_at_85%_30%,rgba(144,122,169,0.14),transparent_30%)]" />
      <div className="relative grid h-full grid-cols-[44px_1fr] gap-3 pt-6">
        <div className="flex flex-col items-center gap-2 rounded-md border border-[#575279]/12 bg-[#232136]/80 px-2 py-3">
          <CustomTag color="rose" className="text-base! font-semibold">
            うち
          </CustomTag>
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="h-1.5 w-5 rounded bg-white/35" />
            <div className="h-1.5 w-5 rounded bg-white/20" />
            <div className="h-1.5 w-5 rounded bg-white/20" />
          </div>
        </div>
        <div className="grid min-h-0 grid-rows-2 gap-3">
          <ToolTile
            label="kakeibo"
            icon={
              <WalletCards
                aria-hidden="true"
                className="h-4 w-4 text-[#286983]"
                strokeWidth={1.8}
              />
            }
          >
            <div className="grid grid-cols-5 items-end gap-1.5">
              {[26, 42, 22, 52, 36].map((height) => (
                <div
                  key={height}
                  className="rounded-t bg-[#286983]/35"
                  style={{ height }}
                />
              ))}
            </div>
          </ToolTile>
          <ToolTile
            label="model vs model"
            icon={
              <PanelLeft
                aria-hidden="true"
                className="h-4 w-4 text-[#907aa9]"
                strokeWidth={1.8}
              />
            }
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5 rounded border border-[#907aa9]/25 p-2">
                <div className="h-1.5 w-12 rounded bg-[#907aa9]/35" />
                <div className="h-1.5 w-8 rounded bg-[#907aa9]/25" />
              </div>
              <div className="space-y-1.5 rounded border border-[#b4637a]/25 p-2">
                <div className="h-1.5 w-10 rounded bg-[#b4637a]/35" />
                <div className="h-1.5 w-12 rounded bg-[#b4637a]/25" />
              </div>
            </div>
          </ToolTile>
        </div>
      </div>
    </SimpleCard>
  );
}

function InnerCircleCard() {
  return (
    <SimpleCard className="relative cursor-not-allowed overflow-hidden rounded-lg border border-(--ifm-color-emphasis-200) bg-[#f8f7f6]!">
      <LockedTag />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,243,0.6),rgba(180,99,122,0.1))]" />
      <div className="absolute left-7 top-7 h-28 w-36 rounded-md border border-[#575279]/12 bg-white/60 shadow-sm">
        <div className="absolute left-4 top-4 h-2 w-20 rounded-full bg-[#575279]/18" />
        <div className="absolute left-4 top-9 h-2 w-14 rounded-full bg-[#575279]/12" />
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          <div className="h-7 w-7 rounded bg-[#b4637a]/18" />
          <div className="h-7 w-7 rounded bg-[#286983]/18" />
          <div className="h-7 w-7 rounded bg-[#907aa9]/18" />
        </div>
      </div>
      <div className="absolute bottom-7 right-7 h-28 w-32 rounded-md border border-[#575279]/12 bg-[#232136]/88 p-4 text-white shadow-md">
        <BookOpenText
          aria-hidden="true"
          className="mb-7 h-5 w-5 text-[#ebbcba]"
          strokeWidth={1.8}
        />
        <div className="h-1.5 w-16 rounded bg-white/35" />
        <div className="mt-1.5 h-1.5 w-11 rounded bg-white/20" />
      </div>
      <div className="absolute bottom-7 left-7 flex flex-col gap-2">
        <CustomTag color="rose" className="text-2xl! font-semibold">
          うち
        </CustomTag>
        <span className="text-[11px] uppercase tracking-normal text-[#575279]/70">
          personal systems
        </span>
      </div>
    </SimpleCard>
  );
}

export const UchiHomeProject: GalleryProjectInfo = {
  id: "uchi-home-mockup",
  title: "うち A",
  subtitle: "Private workspace",
  containerCss: "md:col-span-3",
  card: HomeCard,
  banner: () => <></>,
  description: UchiDescription,
};

export const UchiDashboardProject: GalleryProjectInfo = {
  id: "uchi-dashboard-mockup",
  title: "うち B",
  subtitle: "Local tools",
  containerCss: "md:col-span-3",
  card: DashboardCard,
  banner: () => <></>,
  description: UchiDescription,
};

export const UchiInnerCircleProject: GalleryProjectInfo = {
  id: "uchi-inner-circle-mockup",
  title: "うち C",
  subtitle: "Inner circle",
  containerCss: "md:col-span-3",
  card: InnerCircleCard,
  banner: () => <></>,
  description: UchiDescription,
};
