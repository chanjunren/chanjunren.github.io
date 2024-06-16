import { FC } from "react";
import SecondaryHeader from "../common/SecondaryHeader";
import TypewriterText from "../common/TypewriterText";
import { GalleryProject } from "../home/types";
import BadgeList from "./BadgeList";

const ProjectInfo: FC<GalleryProject> = ({ title, dob, badges }) => {
  return (
    <section className="col-span-4 flex">
      <div className="flex-col flex">
        <TypewriterText text={title.toUpperCase()} active />
        <SecondaryHeader>🗓️ {dob}</SecondaryHeader>
        <BadgeList badges={badges} />
      </div>
    </section>
  );
};

export default ProjectInfo;
