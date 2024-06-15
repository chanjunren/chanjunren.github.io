import LayoutWrapper from "../components/common/LayoutWrapper";
import WelcomeSection from "../components/home/Welcome";

export default function Home(): JSX.Element {
  return (
    <LayoutWrapper
      title={"home"}
      description="Hello! Welcome to my digital garden"
    >
      <div className="grid lg:grid-cols-6 grid-cols-1 gap-x-10 gap-y-5 justify-items-center">
        <WelcomeSection />
      </div>
    </LayoutWrapper>
  );
}
