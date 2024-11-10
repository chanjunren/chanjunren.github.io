import { GalleryProjectInfo } from "@site/src/types";
import HoverCard from "../../common/HoverCard";
import SecondaryHeader from "../../common/SecondaryHeader";
import PixelLab from "./PixelLab";

const PixelLabInfo: GalleryProjectInfo = {
  id: "pixelLab",
  title: "Pixel Lab",
  subtitle: "CSS / SVG Exploration",
  card: ({ onClick }) => (
    <HoverCard
      className="flex justify-center items-center h-64 cursor-pointer gap-5 rounded-lg hover:-rotate-1"
      onClick={onClick}
    >
      <p className="text-3xl text-center">🐴🐖</p>
      <p className="text-3xl text-center">🐕🐍</p>
      <p className="text-3xl text-center">🐄🐭</p>
      <p className="text-3xl text-center">🐇🐉</p>
    </HoverCard>
  ),
  banner: () => null,
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => <PixelLab />,
  repository: "https://github.com/chanjunren/vaultusaurus",
  // Span of 8 / 12
  metadata: () => (
    <>
      <div className="flex flex-col gap-2 lg:col-span-2 col-span-4">
        <SecondaryHeader>Created with</SecondaryHeader>
        <div className="flex flex-col gap-1">
          <span>CSS</span>
          <span>SVG</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 col-span-4">
        <SecondaryHeader>Date</SecondaryHeader>
        <span>COMING SOON</span>
      </div>
    </>
  ),
  extraButtons: ({ className }) => (
    <>
      {/* <DocusaurusLink
        className={className}
        to={"https://github.com/chanjunren/vaultusaurus/wiki"}
        subLabel="📚"
        label="Wiki"
      />
      <DocusaurusLink
        className={className}
        to={"https://chanjunren.github.io/docs/zettelkasten/skywalking"}
        subLabel="📃"
        label="Sample"
      /> */}
    </>
  ),
};

export default PixelLabInfo;
