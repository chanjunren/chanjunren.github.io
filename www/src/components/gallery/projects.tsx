import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import type { Props } from "@theme/IdealImage";
import { GalleryCardProps, GalleryProject } from "./types";

const DefaultImg: React.FC<Props> = (props: Props & GalleryCardProps) => (
  <Image
    {...props}
    className={`h-[60%] rounded-md object-contain w-fit border-2 border-solid ${
      props.selected ? "opacity-80 border-white" : "border-transparent"
    }`}
  />
);

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "threejs_portal",
    card: (props: GalleryCardProps) => (
      <DefaultImg img={useBaseUrl("gallery/portal.png")} {...props} />
    ),
    display: () => <div>HEllo2</div>,
    dob: "220524",
    tags: ["threejs", "blender"],
  },
];
