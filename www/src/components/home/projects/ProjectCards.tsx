import useBaseUrl from "@docusaurus/useBaseUrl";
import { FC } from "react";
import useGallery from "../hooks/useGallery";
import { GalleryProject } from "../types";
import ProjectCard from "./ProjectCard";
import PortalProject from "./portal";

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
    <div className="flex gap-2 max-h-20 min-w-20 md:hidden">{projects}</div>
  );
};

export default ProjectCards;
