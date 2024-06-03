import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import type { Props } from "@theme/IdealImage";
import PortalWrapper from "./projects/portal";
import { GalleryCardProps, GalleryProject } from "./types";

const ImageCard: React.FC<Props> = (props: Props & GalleryCardProps) => (
  <Image
    {...props}
    className={`min-[996px]:h-[75px] w-fit rounded-xl  object-contain border-2 border-solid ${
      props.selected ? "opacity-80 border-white" : "border-transparent"
    }`}
  />
);

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "threejs_portal",
    card: (props: GalleryCardProps) => (
      <ImageCard img={useBaseUrl("gallery/portal.png")} {...props} />
    ),
    display: () => <PortalWrapper />,
    dob: "220524",
    tags: ["threejs", "blender"],
  },
];
