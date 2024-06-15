import LayoutWrapper from "../components/common/LayoutWrapper";
import useGallery from "../components/home/hooks/useGallery";
import ProjectCards from "../components/home/projects/ProjectCards";
import Spotlight from "../components/home/projects/Spotlight";
import WelcomeSection from "../components/home/Welcome";

export default function Home(): JSX.Element {
  const { selectedProject } = useGallery();
  console.log(selectedProject === null);
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div
        className={`${
          selectedProject === null
            ? "grid xl:grid-cols-6 lg:grid-cols-5 grid-cols-1 gap-x-10 gap-y-5 items-center justify-items-center"
            : "flex flex-col"
        } `}
      >
        <WelcomeSection />
        <ProjectCards />
        <Spotlight />
      </div>
    </LayoutWrapper>
  );
}
