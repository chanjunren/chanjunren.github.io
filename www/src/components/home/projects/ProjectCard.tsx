import IdealImage, { Props } from "@theme/IdealImage";
import { GalleryCardProps } from "../types";

const ProjectCard: React.FC<Props & GalleryCardProps> = ({
  img,
  selected,
  cardImgClass,
  onClick,
  mini,
  label,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <IdealImage
        onClick={onClick}
        img={img}
        className={`cursor-pointer rounded-xl !h-fit object-contain border-2 border-solid ${cardImgClass} 
        ${selected ? "opacity-80 border-white" : "border-transparent"} 
        ${mini ? "max-h-20" : ""}`}
      />
      {!mini && (
        <span className="m-1 text-sm self-end">{label.toUpperCase()}</span>
      )}
    </div>
  );
};

export default ProjectCard;
