import useBaseUrl from "@docusaurus/useBaseUrl";
import { GalleryProject } from "@site/src/types";
import { FC } from "react";
import PortalProject from "../projects/portal";
import useGallery from "./hooks/useGallery";
import ProjectCard from "./ProjectCard";

export const GALLERY_PROJECTS: GalleryProject[] = [PortalProject];

const ProjectCards: FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();

  const projects = GALLERY_PROJECTS.map((proj) => (
    <ProjectCard
      label={proj.title}
      mini={selectedProject !== null}
      onClick={() => onGalleryProjSelected(proj)}
      selected={selectedProject?.id === proj?.id}
      key={`proj-${proj.id}`}
      img={useBaseUrl(proj.cardUrl)}
      cardImgClass={proj.cardImgClass}
    />
  ));

  return selectedProject === null ? (
    <>{projects}</>
  ) : (
    <div className="gap-2 max-h-20 min-w-20 hidden lg:flex">{projects}</div>
  );
};

export default ProjectCards;
