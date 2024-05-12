import Layout from "@theme/Layout";
import GalleryCarousel from "../components/gallery/components/GalleryCarousel";
import GallerySpotLight from "../components/gallery/components/GallerySpotlight";
import useGallery from "../components/gallery/hooks/useGallery";

const Gallery: React.FC = () => {
  const { selectedProject } = useGallery([]);
  return (
    <Layout title="Hello" description="Hello React Page">
      <div className="flex flex-col w-full h-[90vh] p-10">
        <GallerySpotLight />
        <GalleryCarousel selectedProject={selectedProject} />
      </div>
    </Layout>
  );
};

export default Gallery;
