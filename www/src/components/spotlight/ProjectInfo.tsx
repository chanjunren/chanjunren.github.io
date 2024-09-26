import SecondaryHeader from "@site/src/components/common/SecondaryHeader";
import TypewriterText from "@site/src/components/common/TypewriterText";
import { GalleryProject } from "@site/src/types";
import { FC } from "react";
import BadgeList from "./BadgeList";

const ProjectInfo: FC<GalleryProject> = ({
  title,
  dob,
  badges,
  description: Description,
}) => {
  return (
    <section className="grid grid-cols-12 gap-5">
      <TypewriterText
        text={title.toUpperCase()}
        active
        size="lg"
        className="lg:col-span-4 col-span-12 row-span-5"
      />
      <div className="lg:col-span-8 col-span-12">
        <Description />
      </div>
      <div className="col-span-4">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Made with</SecondaryHeader>
          <BadgeList badges={badges} />
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex flex-col gap-2">
          <SecondaryHeader>Date</SecondaryHeader>
          <span>{dob}</span>
        </div>
      </div>

      <div className="lg:col-span-8 col-span-12">{/* Buttons */}</div>
    </section>
  );
};

export default ProjectInfo;
