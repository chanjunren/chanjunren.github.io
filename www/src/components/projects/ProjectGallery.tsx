import { GalleryProject } from "@site/src/types";
import { FC, PropsWithChildren } from "react";
import useGallery from "../home/hooks/useGallery";
import PortalProject from "./portal";
import ProjectCard from "./ProjectCard";

export const GALLERY_PROJECTS: GalleryProject[] = [PortalProject];

type ProjectGalleryProps = {
  view: "gallery" | "list";
};

const ProjectGalleryColumn: FC<ProjectGalleryProps & PropsWithChildren> = ({
  children,
}) => {
  return <div className="col-span-12 lg:col-span-4">{children}</div>;
};
const ProjectGallery: FC<ProjectGalleryProps> = ({ view }) => {
  const { selectedProject, onGalleryProjSelected } = useGallery();

  const projectCards = GALLERY_PROJECTS.map((proj) => (
    <ProjectCard
      label={proj.title}
      mini={selectedProject !== null}
      onClick={() => onGalleryProjSelected(proj)}
      selected={selectedProject?.id === proj?.id}
      key={`proj-${proj.id}`}
      card={proj.card}
      cardImgClass={proj.cardImgClass}
    />
  ));

  const columns = [[], [], []] as JSX.Element[][];

  projectCards.forEach((card, index) => {
    columns[index % 3].push(card);
  });

  return view === "gallery" ? (
    <>
      <ProjectGalleryColumn view={view}>{columns[0]}</ProjectGalleryColumn>
      <ProjectGalleryColumn view={view}>{columns[1]}</ProjectGalleryColumn>
      <ProjectGalleryColumn view={view}>{columns[2]}</ProjectGalleryColumn>
    </>
  ) : null;
};

export default ProjectGallery;