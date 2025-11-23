import { GalleryProjectInfo } from "@site/src/types";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import SimpleCard from "@site/src/components/ui/simple-card";
import Experiments from "./experiments";

const PixelLabInfo: GalleryProjectInfo = {
  id: "pixelLab",
  title: "Pixel Lab",
  subtitle: "CSS / SVG Exploration",
  containerCss: "md:col-span-3",
  card: ({ onClick }) => (
    <SimpleCard
      onClick={onClick}
      className="cursor-pointer rounded-lg relative"
    >
      <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
        📟
      </p>
    </SimpleCard>
  ),
  banner: () => <Experiments />,
  description: () => (
    <div className="flex flex-col w-full gap-5">
      <span>Mini projects for exploring CSS / SVG related features!</span>
      <span>
        Some of these are from Nanda Syahrasyad's{" "}
        <a href="https://www.svg-animations.how/" target="_blank">
          SVG course
        </a>
      </span>
    </div>
  ),
  repository: "https://github.com/chanjunren/vaultusaurus",
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
        <span>Pasting here as I learn :D</span>
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
