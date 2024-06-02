import useGallery from "../../hooks/useGallery";

const DefaultComponent: React.FC = () => <div>No project selected</div>;

export default function Spotlight() {
  const { selectedProject } = useGallery();
  const SpotlightProject = selectedProject?.display || DefaultComponent;

  return (
    <div className="flex-grow">
      <SpotlightProject />
    </div>
  );
}
