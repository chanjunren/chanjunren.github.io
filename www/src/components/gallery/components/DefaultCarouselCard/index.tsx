import TypewriterText from "@site/src/components/common/TypewriterText";
import { useState } from "react";
import { GalleryProject } from "../../types";
import CardHeader from "./CardHeader";

type CarouselCardWrapperProps = {
  selected: boolean;
  onCardSelected: (GalleryProject) => void;
  project: GalleryProject;
};

const DefaultCarouselCard: React.FC<CarouselCardWrapperProps> = ({
  selected,
  onCardSelected,
  project,
}) => {
  const { card: Card, dob } = project;
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className={"group/card flex flex-col gap-2 cursor-pointer"}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onCardSelected(project)}
    >
      <CardHeader project={project} active={hovering} />
      <Card selected={selected} />
      <TypewriterText text={dob} active={hovering || selected} />
    </div>
  );
};

export default DefaultCarouselCard;
