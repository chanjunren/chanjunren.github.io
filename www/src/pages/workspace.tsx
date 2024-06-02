import Layout from "@theme/Layout";
import Carousel from "../components/gallery/components/Carousel";
import Spotlight from "../components/gallery/components/Spotlight";

const Workspace: React.FC = () => {
  return (
    <Layout title={"workspace"} description="Hello! Welcome to my workspace">
      <div className="flex flex-col w-full h-screen-minus-navbar p-5">
        <Spotlight />
        <Carousel />
      </div>
    </Layout>
  );
};

export default Workspace;
