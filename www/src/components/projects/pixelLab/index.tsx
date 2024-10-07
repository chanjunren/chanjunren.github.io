import { GalleryProjectInfo } from "@site/src/types";
import SecondaryHeader from "../../common/SecondaryHeader";
import PixelLab from "./PixelLab";

const PixelLabInfo: GalleryProjectInfo = {
  id: "pixelLab",
  title: "Pixel Lab",
  subtitle: "CSS / SVG Exploration",
  card: ({ onClick }) => (
    <div
      className="flex items-center w-full justify-center h-60 cursor-pointer gap-5 bg-circuitBoard rounded-lg"
      onClick={onClick}
    >
      <span className="text-5xl">👾</span>
    </div>
  ),
  banner: () => (
    <div className="flex items-center w-full justify-center h-60 cursor-pointer gap-5 bg-circuitBoard rounded-lg">
      <span className="text-5xl">👾</span>
    </div>
  ),
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
