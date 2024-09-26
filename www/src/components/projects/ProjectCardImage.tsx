import { GalleryCard } from "@site/src/types";
import IdealImage from "@theme/IdealImage";

const ProjectCardImage: React.FC<GalleryCard> = ({
  onClick,
  card: cardImgUrl,
  cardImgClass,
  selected,
  mini,
}) => {
  if (!cardImgUrl) {
    return null;
  }
  return (
    <IdealImage
      onClick={onClick}
      img={cardImgUrl}
      className={`cursor-pointer rounded-xl !h-fit object-contain border-2 border-solid ${cardImgClass} 
    ${selected ? "opacity-80 border-white" : "border-transparent"} 
    ${mini ? "max-h-20" : ""}`}
    />
  );
};

export default ProjectCardImage;
