import { GalleryProjectInfo } from "@site/src/types";
import { DocusaurusIcon } from "../../common/Icons";

const VaultusaurusProject: GalleryProjectInfo = {
  id: "vaultusaurus",
  title: "Vaultusaurus",
  subtitle: "Docusaurus plugin",
  card: ({ onClick }) => (
    <div
      className="flex items-center w-full justify-center h-36 cursor-pointer gap-5 bg-graphPaper rounded-lg border-[#D3D3D3] border-[1px] border-solid border-opacity-40"
      onClick={onClick}
    >
      <DocusaurusIcon className="h-14 w-14" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  banner: () => (
    <div className="flex items-center w-full justify-center h-36 cursor-pointer gap-5 bg-graphPaper">
      <DocusaurusIcon className="h-14 w-14" />
      <span className="text-5xl">🔌</span>
    </div>
  ),
  dob: "03082024 - NOW",
  badges: ["REACT"],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => (
    <span>
      Docusaurus plugin for transforming Obsidian's markdown syntax into
      Docusaurus-compatible format and rendering Obsidian's Local Graph
    </span>
  ),
  repository: "https://github.com/chanjunren/vaultusaurus",
};

export default VaultusaurusProject;
