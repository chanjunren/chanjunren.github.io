import { GalleryProjectInfo } from "@site/src/types";
import SecondaryHeader from "../../common/SecondaryHeader";
import SimpleCard from "../../common/SimpleCard";
import PixelLab from "./PixelLab";

const PixelLabInfo: GalleryProjectInfo = {
  id: "pixelLab",
  title: "Pixel Lab",
  subtitle: "CSS / SVG Exploration",
  card: () => (
    <SimpleCard className="cursor-not-allowed rounded-lg min-h-44 relative">
      <p className="absolute bg-black bg-opacity-75 px-2 py-1 rounded-md text-white top-3 right-3 m-0">
        locked
      </p>
      <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
        🪴
      </p>
    </SimpleCard>
  ),
  banner: () => null,
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
