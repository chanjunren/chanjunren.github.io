import useGallery from "../../hooks/useGallery";

export default function Spotlight() {
  const { selectedProject } = useGallery();
  const SpotlightProject = selectedProject.display;

  return (
    <div className="flex-grow px-8">
      <SpotlightProject />
    </div>
  );
}
