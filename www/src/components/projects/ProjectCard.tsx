import { GalleryCard } from "@site/src/types";
import SecondaryHeader from "../common/SecondaryHeader";
import ProjectCardImage from "./ProjectCardImage";

const ProjectCard: React.FC<GalleryCard> = (props) => {
  const { info, onClick } = props;
  const { title, subtitle, card: Card } = info;
  return (
    <div className={`flex flex-col mb-5 ${info.containerCss}`}>
      {typeof Card === "string" ? (
        <ProjectCardImage {...props} />
      ) : (
        <Card onClick={onClick} />
      )}
      <span className="self-end mt-2">{title.toUpperCase()}</span>
      <SecondaryHeader className="self-end">
        {subtitle.toUpperCase()}
      </SecondaryHeader>
    </div>
  );
};

export default ProjectCard;
