import { GalleryProjectInfo } from "@site/src/types";
import SimpleCard from "../../common/SimpleCard";
import Playground from "./Playground";

const ThreeJsCheatsheetInfo: GalleryProjectInfo = {
  id: "threeJsLab",
  title: "3JS Lab",
  displayTitle: false,
  displayNav: false,
  subtitle: "3JS",
  containerCss: "md:col-span-3",
  card: ({ onClick }) => (
    <SimpleCard
      className="rounded-lg relative cursor-pointer"
      onClick={onClick}
    >
      <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
        🎛️
      </p>
    </SimpleCard>
  ),
  banner: () => <Playground />,
  description: () => <></>,
  metadata: () => <></>,
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

export default ThreeJsCheatsheetInfo;
