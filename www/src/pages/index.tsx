import LayoutWrapper from "../components/common/LayoutWrapper";
import ProjectCards from "../components/home/projects/ProjectCards";
import WelcomeSection from "../components/home/Welcome";

export default function Home(): JSX.Element {
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 grid-cols-1 gap-x-10 gap-y-5 items-start justify-items-center">
        <WelcomeSection />
        <ProjectCards />
      </div>
    </LayoutWrapper>
  );
}
