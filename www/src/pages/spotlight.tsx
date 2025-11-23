import { FC } from "react";
import Page from "@site/src/components/ui/page";
import WIP from "@site/src/components/home/wip";
import useGallery from "@site/src/hooks/useGallery";
import ProjectInfo from "@site/src/components/spotlight/project-info";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();
  const showNav =
    selectedProject?.displayNav === undefined
      ? true
      : selectedProject.displayNav;

  return (
    <Page
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
      className="lg:max-w-5xl flex flex-col justify-start gap-10"
    >
      {/* {showNav && <NavButton className="self-start" label="back" path="/" />} */}
      {selectedProject !== null ? (
        <>
          <selectedProject.banner />
          <ProjectInfo {...selectedProject} />
        </>
      ) : (
        <WIP />
      )}
    </Page>
  );
};

export default Spotlight;
