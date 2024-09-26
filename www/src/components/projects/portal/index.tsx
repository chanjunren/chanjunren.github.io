import { GalleryProjectInfo } from "@site/src/types";
import Portal from "./Portal";

const PortalProject: GalleryProjectInfo = {
  id: "portal",
  title: "ThreeJS Portal",
  subtitle: "ThreeJS",
  card: "images/portal.png",
  banner: () => <Portal />,
  dob: "220524",
  badges: ["THREE_JS", "BLENDER", "MY_LOVE"],
  cardImgClass: "col-span-2 md:col-span-1",
  repository:
    "https://github.com/chanjunren/chanjunren.github.io/tree/master/www/src/components/projects/portal",
  description: () => (
    <span>
      Made from one of the lessons of Bruno Simon's{" "}
      <a href="https://threejs-journey.com/" target="_blank">
        course
      </a>
      !
    </span>
  ),
};

export default PortalProject;
