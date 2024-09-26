import useBaseUrl from "@docusaurus/useBaseUrl";
import { GalleryCard } from "@site/src/types";
import IdealImage from "@theme/IdealImage";

const ProjectCardImage: React.FC<GalleryCard> = ({
  onClick,
  info,
  cardImgClass,
  selected,
  mini,
}) => {
  const { card } = info;
  if (!card || typeof card !== "string") {
    return null;
  }

  return (
    <IdealImage
      onClick={onClick}
      card={useBaseUrl(card)}
      img={card}
      className={`cursor-pointer rounded-xl !h-fit object-contain border-2 border-solid ${cardImgClass} 
    ${selected ? "opacity-80 border-white" : "border-transparent"} 
    ${mini ? "max-h-20" : ""}`}
    />
  );
};

export default ProjectCardImage;
