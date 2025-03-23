import { GalleryProjectInfo } from "@site/src/types";
import { FC } from "react";
import SimpleCard from "../../common/SimpleCard";
import BuildingInProgress from "../../home/BuildingInProgress";
import FloatingMenu from "./floatingmenu";

const ThreeJsCheatsheet: FC = () => {
  return (
    <div className="w-full flex-grow content-center justify-items-center">
      <FloatingMenu />
      <BuildingInProgress />
    </div>
  );
};

const ThreeJsCheatsheetInfo: GalleryProjectInfo = {
  id: "threeJsLab",
  title: "Three JS Cheatsheet",
  displayTitle: false,
  subtitle: "threeJS",
  containerCss: "md:col-span-3",
  card: ({ onClick }) => (
    <SimpleCard
      className="rounded-lg relative cursor-pointer"
      onClick={onClick}
    >
      <p className="text-3xl absolute top-1/2 left-1/2 m-0 transform -translate-x-1/2 -translate-y-1/2">
        🍉
      </p>
    </SimpleCard>
  ),
  banner: () => <ThreeJsCheatsheet />,
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
