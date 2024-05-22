import Layout from "@theme/Layout";
import Carousel from "../components/gallery/components/Carousel";
import Spotlight from "../components/gallery/components/Spotlight";
import useGallery from "../components/gallery/hooks/useGallery";

const Workspace: React.FC = () => {
  const { selectedProject, onGalleryProjSelected } = useGallery();
  return (
    <Layout title={"workspace"} description="Hello! Welcome to my workspace">
      <div className="flex flex-col w-full h-screen-minus-navbar p-5">
        <Spotlight />
        <Carousel
          selectedProject={selectedProject}
          onCardSelected={onGalleryProjSelected}
        />
      </div>
    </Layout>
  );
};

export default Workspace;
