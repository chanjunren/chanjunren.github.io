import { GalleryProject } from "@site/src/types";

const VaultusaurusProject: GalleryProject = {
  id: "vaultusaurus",
  title: "Vaultusaurus",
  card: "images/portal.png",
  // mainDisplay: () => <Portal />,
  dob: "220524",
  badges: ["REACT", "BLENDER", "MY_LOVE"],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => <></>,
};

export default VaultusaurusProject;
