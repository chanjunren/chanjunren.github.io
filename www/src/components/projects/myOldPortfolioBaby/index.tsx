import SecondaryHeader from "@site/src/components/common/SecondaryHeader";
import BadgeList from "@site/src/components/spotlight/BadgeList";
import { GalleryProjectInfo } from "@site/src/types";

import useBaseUrl from "@docusaurus/useBaseUrl";
import IdealImage from "@theme/IdealImage";

const MyOldPortfolioBaby: GalleryProjectInfo = {
  id: "myOldPortfolioBaby",
  title: "My old portfolio",
  subtitle: "RIP",
  banner: () => (
    <IdealImage
      img={"images/oldPortfolioBanner.webp"}
      card={useBaseUrl("images/oldPortfolioBanner.webp")}
    />
  ),
  containerCss: "md:col-span-3",
  card: "/images/oldPortfolioCard.webp",
  repository:
    "https://github.com/chanjunren/chanjunren.github.io/commit/2282566cd128e868124903f9bab5d3344671ae5e",
  description: () => (
    <div className="flex flex-col gap-5">
      <span>In loving memory of my portfolio before a major revamp 🫡</span>
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
