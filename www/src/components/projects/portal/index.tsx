import SecondaryHeader from "@site/src/components/common/SecondaryHeader";
import BadgeList from "@site/src/components/spotlight/BadgeList";
import { GalleryProjectInfo } from "@site/src/types";
import Portal from "./Portal";

const PortalProject: GalleryProjectInfo = {
  id: "portal",
  title: "ThreeJS Portal",
  subtitle: "ThreeJS",
  card: "images/portal.webp",
  containerCss: "md:col-span-4",
  banner: () => <Portal />,
  repository:
    "https://github.com/chanjunren/chanjunren.github.io/tree/master/www/src/components/projects/portal",
  description: () => (
    <div className="flex flex-col gap-5">
      <span>
        Mini project as a reference for my takeaways from Bruno Simon's{" "}
        <a href="https://threejs-journey.com/" target="_blank">
          course
        </a>
        !
      </span>
      <span>
        I highly recommend this course if you are interested in ThreeJS
      </span>
    </div>
  ),
  metadata: () => (
    <>
      <div className="lg:col-span-4 col-span-6 py-5">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Made with</SecondaryHeader>
          <BadgeList badges={["THREE_JS", "BLENDER", "MY_LOVE"]} />
        </div>
      </div>
      <div className="lg:col-span-4 col-span-6 py-5">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Date</SecondaryHeader>
          <span>220524</span>
        </div>
      </div>
    </>
  ),
};

export default PortalProject;
