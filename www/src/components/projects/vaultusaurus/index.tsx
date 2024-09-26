import { Separator } from "@radix-ui/react-separator";
import { GalleryProjectInfo } from "@site/src/types";
import { DocusaurusIcon } from "../../common/Icons";

const VaultusaurusProject: GalleryProjectInfo = {
  id: "vaultusaurus",
  title: "Vaultusaurus",
  subtitle: "Docusaurus plugin",
  card: ({ onClick }) => (
    <div
      className="flex items-center w-full justify-center h-36 cursor-pointer"
      onClick={onClick}
    >
      <DocusaurusIcon className="h-14 w-14" />
      <Separator orientation="vertical" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  mainDisplay: () => (
    <div className="flex items-center w-full justify-center h-36">
      <DocusaurusIcon className="h-14 w-14" />
      <Separator orientation="vertical" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  dob: "WIP",
  badges: [],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => (
    <span>
      Docusaurus plugin for transforming Obsidian's markdown syntax into
      Docusaurus-compatible format and rendering Obsidian's Local Graph
    </span>
  ),
};

export default VaultusaurusProject;
