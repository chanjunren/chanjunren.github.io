import { FC } from "react";
import useGallery from "../hooks/useGallery";

const Spotlight: FC = () => {
  const { selectedProject } = useGallery();
  if (!selectedProject) {
    return <></>;
  }

  return <section className="flex-grow px-8"></section>;
};

export default Spotlight;
