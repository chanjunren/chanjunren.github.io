import { GalleryProject } from "../../types";
import PortalScene from "./PortalScene";

const PortalProject: GalleryProject = {
  id: "threejs_portal",
  cardUrl: "gallery/portal.png",
  display: () => <PortalScene />,
  dob: "220524",
  tags: ["threejs", "blender"],
  // cardImgClass: "col-span-1 lg:col-span-2",
};

export default PortalProject;
