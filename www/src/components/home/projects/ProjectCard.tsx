import IdealImage, { Props } from "@theme/IdealImage";
import { GalleryCardProps } from "../types";

const ProjectCard: React.FC<Props & GalleryCardProps> = ({
  img,
  selected,
  cardImgClass,
  onClick,
  mini,
}) => (
  <IdealImage
    onClick={onClick}
    img={img}
    className={`rounded-xl !h-fit object-contain border-2 border-solid ${cardImgClass} ${
      selected ? "opacity-80 border-white" : "border-transparent"
    } ${mini ? "max-h-20" : ""}`}
  />
);

export default ProjectCard;
