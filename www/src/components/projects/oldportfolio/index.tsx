import SecondaryHeader from "@site/src/components/ui/secondary-header";
import BadgeList from "@site/src/components/spotlight/badge-list";
import { GalleryProjectInfo } from "@site/src/types";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { FC, useState } from "react";

import useBaseUrl from "@docusaurus/useBaseUrl";

const homepageSnapshots = [
  {
    date: "20220111",
    title: "Original portfolio banner",
    image: "images/oldPortfolioBanner.webp",
  },
  {
    date: "20240924",
    title: "Sage green personal dashboard",
    commit: "75bbf8c6c89edf15785793c42a983c38e1f3af2e",
    image: "images/oldportfolio-history/2024-dashboard.jpg",
  },
  {
    date: "20250107",
    title: "Image and navigation cards",
    commit: "1d13feb8a507520f15e18f5b920bb4eef0539b5b",
    image: "images/oldportfolio-history/2025-image-home.jpg",
  },
  {
    date: "20250128",
    title: "Compact home screen",
    commit: "bdf5d5bcc3d3ff37d0e887dc474d4092ee43aedb",
    image: "images/oldportfolio-history/2025-compact-home.jpg",
  },
];

// Bento layout: hero tile on the left, two stacked tiles on the right, wide strip below.
// Cropped tiles fill fixed md rows; uncropped tiles keep the image's natural height.
const tileLayouts = [
  { tile: "md:col-span-2 md:row-span-2", cropped: true },
  { tile: "md:col-span-1", cropped: true },
  { tile: "md:col-span-1", cropped: true },
  { tile: "md:col-span-3", cropped: false },
];

type Snapshot = (typeof homepageSnapshots)[number];

type SnapshotTileProps = {
  snapshot: Snapshot;
  layout: (typeof tileLayouts)[number];
};

const SnapshotTile: FC<SnapshotTileProps> = ({ snapshot, layout }) => {
  const baseUrl = useBaseUrl("/");
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <a
      aria-label={`Open full-size image: ${snapshot.title}`}
      className={`relative block overflow-hidden rounded-lg border border-black/10 dark:border-white/10 ${layout.tile}`}
      href={`${baseUrl}${snapshot.image}`}
      rel="noreferrer"
      target="_blank"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <img
        alt={snapshot.date ? `Homepage on ${snapshot.date}: ${snapshot.title}` : snapshot.title}
        className={`block w-full ${layout.cropped ? "md:h-full md:object-cover md:object-top" : ""}`}
        decoding="async"
        src={`${baseUrl}${snapshot.image}`}
      />
      {/* Mounted only while hovering so the typewriter replays and never snaps to full width on leave */}
      {hovering && snapshot.date && (
        <div className="pointer-events-none absolute bottom-3 left-3">
          <TypewriterText
            className="block rounded-sm px-2 py-1 bg-[var(--ifm-font-color-base)]"
            text={snapshot.date}
            active
            duration={0.4}
            color="var(--ifm-background-color)"
          />
        </div>
      )}
    </a>
  );
};

const HomepageSnapshots: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <SecondaryHeader>Portfolio images</SecondaryHeader>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-[14rem_14rem_auto]">
        {homepageSnapshots.map((snapshot, index) => (
          <SnapshotTile
            key={snapshot.image}
            snapshot={snapshot}
            layout={tileLayouts[index % tileLayouts.length]}
          />
        ))}
      </div>
    </div>
  );
};

const MyOldPortfolioBaby: GalleryProjectInfo = {
  id: "myOldPortfolioBaby",
  title: "My old portfolio",
  subtitle: "RIP",
  banner: HomepageSnapshots,
  containerCss: "md:col-span-3",
  card: "/images/oldPortfolioCard.webp",
  repository:
    "https://github.com/chanjunren/chanjunren.github.io/commit/2282566cd128e868124903f9bab5d3344671ae5e",
  description: () => (
    <div className="flex flex-col gap-5">
      <span>In loving memory of my portfolio through its many revamps 🫡</span>
    </div>
  ),
  metadata: () => (
    <>
      <div className="lg:col-span-4 col-span-6 py-5">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Made with</SecondaryHeader>
          <BadgeList badges={["DOCUSAURUS", "MY_LOVE"]} />
        </div>
      </div>
      <div className="lg:col-span-4 col-span-6 py-5">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Date</SecondaryHeader>
          <span>11012022</span>
        </div>
      </div>
    </>
  ),
};

export default MyOldPortfolioBaby;
