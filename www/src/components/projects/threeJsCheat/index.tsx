import { GalleryProjectInfo } from "@site/src/types";
import SimpleCard from "../../common/SimpleCard";

const ThreeJSCheat: GalleryProjectInfo = {
  id: "threeJsLab",
  title: "ThreeJS Cheat Sheet",
  subtitle: "threeJS",
  containerCss: "lg:col-span-3",
  card: () => (
    <SimpleCard className="cursor-not-allowed rounded-lg relative">
      <p className="absolute bg-black bg-opacity-75 px-2 py-1 rounded-md text-white top-3 right-3 m-0">
        locked
      </p>
      <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
        🍉
      </p>
    </SimpleCard>
  ),
  banner: () => null,
  description: () => <></>,
  repository: "https://github.com/chanjunren/vaultusaurus",
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

export default ThreeJSCheat;
