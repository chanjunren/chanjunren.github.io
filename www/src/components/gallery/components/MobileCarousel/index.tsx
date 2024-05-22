import { FC } from "react";
import useGallery from "../../hooks/useGallery";
import { GALLERY_PROJECTS } from "../../projects";
import DefaultCarouselCard from "../DefaultCarouselCard";

const MobileCarousel: FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();

  return (
    <div className="flex flex-col gap-5 h-[20%] px-8">
      {GALLERY_PROJECTS.map((proj, idx) => (
        <DefaultCarouselCard
          key={`gallery-carousel-card-${idx}`}
          project={proj}
          onCardSelected={onGalleryProjSelected}
          selected={selectedProject && selectedProject.id === proj.id}
        />
      ))}
    </div>
  );
};

export default MobileCarousel;
