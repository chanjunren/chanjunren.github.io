import useBaseUrl from "@docusaurus/useBaseUrl";
import { GalleryCard } from "@site/src/types";
import ProjectCardImage from "./ProjectCardImage";

const ProjectCard: React.FC<GalleryCard> = (props) => {
  const { mini, label, card: Card, onClick } = props;
  return (
    <div className="flex flex-col gap-2">
      {typeof Card === "string" ? (
        <ProjectCardImage {...props} card={useBaseUrl(Card)} />
      ) : (
        <Card onClick={onClick} />
      )}
      {!mini && <span className="m-1 self-end">{label.toUpperCase()}</span>}
    </div>
  );
};

export default ProjectCard;
