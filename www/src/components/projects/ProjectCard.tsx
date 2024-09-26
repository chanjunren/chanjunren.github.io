import useBaseUrl from "@docusaurus/useBaseUrl";
import { GalleryCardProps } from "@site/src/types";
import ProjectCardImage from "./ProjectCardImage";

const ProjectCard: React.FC<GalleryCardProps> = (props) => {
  const { mini, label, card } = props;
  return (
    <div className="flex flex-col gap-2">
      {typeof card === "string" ? (
        <ProjectCardImage {...props} card={useBaseUrl(card)} />
      ) : (
        card
      )}
      {!mini && <span className="m-1 self-end">{label.toUpperCase()}</span>}
    </div>
  );
};

export default ProjectCard;
