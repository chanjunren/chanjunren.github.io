import { GalleryProject } from "../../types";
import CardHeader from "./CardHeader";

type CarouselCardWrapperProps = GalleryProject & {
  selected: boolean;
};

const DefaultCarouselCard: React.FC<CarouselCardWrapperProps> = (props) => {
  const { card: Card, dob } = props;
  return (
    <div
      className={
        "group/card flex flex-col gap-2 hover:bg-gray-50/1 pb-4 pl-4 pr-4 rounded-sm"
      }
    >
      <CardHeader {...props} />
      <Card />
      <span>{dob}</span>
    </div>
  );
};

export default DefaultCarouselCard;
