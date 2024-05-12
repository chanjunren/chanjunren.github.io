import Layout from "@theme/Layout";
import Carousel from "../components/gallery/components/Carousel";
import Spotlight from "../components/gallery/components/Spotlight";
import useGallery from "../components/gallery/hooks/useGallery";

const Workspace: React.FC = () => {
  const { selectedProject } = useGallery([]);
  return (
    <Layout title="Hello" description="Hello React Page">
      <div className="flex flex-col w-full h-[90vh] p-10">
        <Spotlight />
        <Carousel selectedProject={selectedProject} />
      </div>
    </Layout>
  );
};

export default Workspace;
