import { useHistory } from "@docusaurus/router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GalleryProject } from "../types";

export default function useGallery(items: GalleryProject[]) {
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(
    null
  );

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlIdParam = urlParams.get("id");

    if (urlIdParam && !selectedProject) {
      const proj = items.find((item) => item.id === urlIdParam);
      setSelectedProject(proj);
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
