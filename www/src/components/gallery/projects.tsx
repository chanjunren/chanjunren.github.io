import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import type { Props } from "@theme/IdealImage";
import { GalleryProject } from "./types";

const DefaultImg: React.FC<Props> = (props: Props) => (
  <Image {...props} className="h-[60%] rounded-md object-contain w-fit" />
);

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "dummy_1",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy0.png")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
    tags: ["threejs", "blender"],
  },
  {
    id: "dummy_1",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy1.png")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
    tags: ["threejs", "blender"],
  },
  {
    id: "dummy_2",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy2.jpeg")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
    tags: ["css", "blender"],
  },
  {
    id: "dummy_3",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy3.png")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
    tags: ["glsl", "blender"],
  },
  {
    id: "dummy_4",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy4.jpg")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
  },
  {
    id: "dummy_5",
    card: () => <DefaultImg img={useBaseUrl("gallery/cards/dummy5.jpg")} />,
    display: () => <div>HEllo2</div>,
    dob: "051124",
    tags: ["threejs", "blender"],
  },
];
