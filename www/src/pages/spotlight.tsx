import ProjectGallery from "@site/src/components/projects/ProjectGallery";
import ProjectInfo from "@site/src/components/spotlight/ProjectInfo";
import { FC } from "react";
import LayoutWrapper from "../components/common/LayoutWrapper";
import BuildingInProgress from "../components/home/BuildingInProgress";
import useGallery from "../components/home/hooks/useGallery";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();

  return (
    <LayoutWrapper
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="flex gap-10 flex-grow p-10 w-full">
        <ProjectGallery view="list" />
        {selectedProject !== null ? (
          <div className="flex-grow flex flex-col max-w-screen gap-5">
            <selectedProject.mainDisplay />
            <ProjectInfo {...selectedProject} />
          </div>
        ) : (
          <BuildingInProgress />
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Spotlight;
