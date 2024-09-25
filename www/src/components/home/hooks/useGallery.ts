import { useHistory } from "@docusaurus/router";
import { GALLERY_PROJECTS } from "@site/src/components/home/ProjectCards";
import { GalleryProject } from "@site/src/types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useGallery() {
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(
    null
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
      setSelectedProject(null);
    }
  }, [location]);

  const onGalleryProjSelected = (proj: GalleryProject) => {
    if (proj.id === selectedProject?.id) {
      return;
    }
    history.push(`/spotlight?id=${proj.id}`);
    setSelectedProject(proj);
  };

  return { selectedProject, onGalleryProjSelected };
}
