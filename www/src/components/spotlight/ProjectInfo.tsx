import TypewriterText from "@site/src/components/common/TypewriterText";
import { GalleryProjectInfo } from "@site/src/types";
import { FC } from "react";
import DocusaurusLink from "../common/DocusaurusLink";

const ProjectInfo: FC<GalleryProjectInfo> = ({
  title,
  repository,
  description: Description,
  extraButtons: ExtraButtons = () => null,
  metadata: Metadata = () => null,
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
      <Metadata />
      <DocusaurusLink
        className="lg:col-span-4 col-span-12"
        to={repository}
        subLabel="</>"
        label="Repository"
      />
      <ExtraButtons className="lg:col-span-4 col-span-12" />
    </section>
  );
};

export default ProjectInfo;
