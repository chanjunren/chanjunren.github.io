import useBaseUrl from "@docusaurus/useBaseUrl";
import { FC } from "react";
import useGallery from "../hooks/useGallery";
import { GalleryProject } from "../types";
import PortalProject from "./portal";
import ProjectCard from "./ProjectCard";

export const GALLERY_PROJECTS: GalleryProject[] = [PortalProject];

const ProjectCards: FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();
  // const selectedProject = null;

  return selectedProject === null ? (
    <>
      {GALLERY_PROJECTS.map((proj) => (
        <ProjectCard
          mini={false}
          onClick={() => onGalleryProjSelected(proj)}
          selected={false}
          key={`proj-${proj.id}`}
          img={useBaseUrl(proj.cardUrl)}
          cardImgClass={proj.cardImgClass}
        />
      ))}
    </>
  ) : (
    <div className="flex gap-2 max-h-20">
      {GALLERY_PROJECTS.map((proj) => (
        <ProjectCard
          mini={true}
          onClick={() => onGalleryProjSelected(proj)}
          selected={selectedProject?.id === proj?.id}
          key={`proj-${proj.id}`}
          img={useBaseUrl(proj.cardUrl)}
          cardImgClass={proj.cardImgClass}
        />
      ))}
    </div>
  );
};

export default ProjectCards;
