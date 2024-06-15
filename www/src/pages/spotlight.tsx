import { Root as Separator } from "@radix-ui/react-separator";
import { FC } from "react";
import BuildingInProgress from "../components/about/BuildingInProgress";
import LayoutWrapper from "../components/common/LayoutWrapper";
import useGallery from "../components/home/hooks/useGallery";
import ProjectCards from "../components/home/projects/ProjectCards";
import ProjectInfo from "../components/spotlight/ProjectInfo";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();

  return (
    <LayoutWrapper
      title={"spotlight"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="flex gap-10 h-screen-navbar-footer">
        <ProjectCards />
        <Separator
          decorative
          className="separatorRoot"
          // style={{ margin: "15px 0" }}
          orientation="vertical"
        />

        {selectedProject !== null ? (
          <div className="flex-grow flex flex-col">
            <ProjectInfo {...selectedProject} />
            <div className="flex-grow">
              <selectedProject.mainDisplay />
            </div>
          </div>
        ) : (
          <BuildingInProgress />
        )}
      </div>
    </LayoutWrapper>
  );
};

export default Spotlight;
