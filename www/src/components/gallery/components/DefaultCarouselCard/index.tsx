import DateWithTypewriterEffect from "@site/src/components/common/DateWithTypewriterEffect";
import { useState } from "react";
import { GalleryProject } from "../../types";
import CardHeader from "./CardHeader";

type CarouselCardWrapperProps = GalleryProject & {
  selected: boolean;
};

const DefaultCarouselCard: React.FC<CarouselCardWrapperProps> = (props) => {
  const { card: Card, dob } = props;
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className={
        "group/card flex flex-col gap-2 hover:bg-gray-50/1 pb-1 pl-4 pr-4 pt-4 rounded-md hover:bg-gray-100/10"
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <CardHeader {...props} />
      <Card />
      <DateWithTypewriterEffect date={dob} active={hovering} />
    </div>
  );
};

export default DefaultCarouselCard;
