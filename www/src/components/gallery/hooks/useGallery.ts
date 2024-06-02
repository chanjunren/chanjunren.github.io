import { useHistory } from "@docusaurus/router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GALLERY_PROJECTS } from "../projects";
import { GalleryProject } from "../types";

export default function useGallery() {
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(
    GALLERY_PROJECTS[0]
  );

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlIdParam = urlParams.get("id");

    if (urlIdParam) {
      const proj = GALLERY_PROJECTS.find((item) => item.id === urlIdParam);
      if (proj) {
        setSelectedProject(proj);
      }
    } else {
      history.push(`?id=${selectedProject.id}`);
    }
  }, [location]);

  const onGalleryProjSelected = (proj: GalleryProject) => {
    if (proj.id === selectedProject?.id) {
      return;
    }
    history.push(`?id=${proj.id}`);
    setSelectedProject(proj);
  };

  return { selectedProject, onGalleryProjSelected };
}
