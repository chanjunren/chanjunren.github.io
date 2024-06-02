import { FC } from "react";
import useGallery from "../../hooks/useGallery";
import { GALLERY_PROJECTS } from "../../projects";
import DefaultCarouselCard from "../DefaultCarouselCard";

const Carousel: FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();

  return (
    <div className="flex gap-5 h-[20%] px-8 max-[996px]:hidden items-center">
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

export default Carousel;
