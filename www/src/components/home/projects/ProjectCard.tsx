import IdealImage, { Props } from "@theme/IdealImage";
import { useState } from "react";
import { GalleryCardProps } from "../types";

const ProjectCard: React.FC<Props & GalleryCardProps> = ({
  img,
  selected,
  cardImgClass,
  onClick,
  mini,
  label,
}) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className="cursor-pointer relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <IdealImage
        onClick={onClick}
        img={img}
        className={`rounded-xl !h-fit object-contain border-2 border-solid ${cardImgClass} 
        ${selected ? "opacity-80 border-white" : "border-transparent"} 
        ${mini ? "max-h-20" : ""}`}
      />
      {!mini && (
        <span
          className={`text-white opacity-0 absolute bottom-4 right-3 bg-[rgba(7,7,7,0.85)] px-2 py-1 rounded-md ${
            hovering ? "opacity-100" : ""
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default ProjectCard;
