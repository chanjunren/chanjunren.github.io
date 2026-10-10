import {GalleryProjectInfo} from "@site/src/types";
import {FC} from "react";
import DocusaurusLink from "@site/src/components/ui/docusaurus-link";
import {SplitFlap} from "@site/src/components/ui/split-flap";

const ProjectInfo: FC<GalleryProjectInfo> = ({
  title,
  displayTitle = true,
  repository,
  description: Description,
  extraButtons: ExtraButtons = () => null,
  metadata: Metadata = () => null,
}) => {
  return (
    <section className="grid grid-cols-12 gap-5">
      {displayTitle && (
        <div className="lg:col-span-4 col-span-12 row-span-5">
          {/* Wraps so long titles stay inside the column on narrow screens. */}
          <SplitFlap flipIn value={title} className="flex-wrap text-xl" />
        </div>
        // <TypewriterText
        //   text={title.toUpperCase()}
        //   active
        //   size="lg"
        //   className="lg:col-span-4 col-span-12 row-span-5"
        // />
      )}
      <div className="lg:col-span-8 col-span-12">
        <Description />
      </div>
      <Metadata />
      {repository && (
        <DocusaurusLink
          className="lg:col-span-4 col-span-12"
          to={repository}
          subLabel="📂"
          label="Repository"
        />
      )}
      <ExtraButtons className="lg:col-span-4 col-span-12" />
    </section>
  );
};

export default ProjectInfo;
