import { GalleryProject } from "../../types";
import Description from "./Description";
import Portal from "./Portal";

const PortalProject: GalleryProject = {
  id: "threejs_portal",
  title: "Simple threeJS portal",
  cardUrl: "gallery/portal.png",
  mainDisplay: () => <Portal />,
  dob: "220524",
  badges: ["THREE_JS", "BLENDER", "MY_LOVE"],
  // cardImgClass: "col-span-1 lg:col-span-2",
  description: () => <Description />,
};

export default PortalProject;
