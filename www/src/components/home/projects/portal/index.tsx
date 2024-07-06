import { GalleryProject } from "../../types";
import Portal from "./Portal";

const PortalProject: GalleryProject = {
  id: "portal",
  title: "ThreeJS Portal",
  cardUrl: "images/portal.png",
  mainDisplay: () => <Portal />,
  dob: "220524",
  badges: ["THREE_JS", "BLENDER", "MY_LOVE"],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => <></>,
};

export default PortalProject;
