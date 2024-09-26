import { GalleryProject } from "@site/src/types";
import Portal from "./Portal";

const PortalProject: GalleryProject = {
  id: "portal",
  title: "ThreeJS Portal",
  card: "images/portal.png",
  mainDisplay: () => <Portal />,
  dob: "220524",
  badges: ["THREE_JS", "BLENDER", "MY_LOVE"],
  cardImgClass: "col-span-2 md:col-span-1",
  description: () => (
    <span>Made from one of the lessons of Bruno Simon's course!</span>
  ),
};

export default PortalProject;
