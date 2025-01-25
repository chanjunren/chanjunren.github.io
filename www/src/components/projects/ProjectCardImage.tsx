import useBaseUrl from "@docusaurus/useBaseUrl";
import { GalleryCard } from "@site/src/types";
import IdealImage from "@theme/IdealImage";

const ProjectCardImage: React.FC<GalleryCard> = ({ onClick, info }) => {
  const { card } = info;
  if (!card || typeof card !== "string") {
    return null;
  }

  return (
    <IdealImage
      onClick={onClick}
      card={useBaseUrl(card)}
      img={card}
      className={`cursor-pointer rounded-lg  min-h-44`}
    />
  );
};

export default ProjectCardImage;
