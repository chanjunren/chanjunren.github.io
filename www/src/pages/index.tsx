import Layout from "@theme/Layout";

import EducationSection from "../components/home/Education";
import LitFooter from "../components/home/LitFooter";
import ProjectsSection from "../components/home/Projects";
import WelcomeSection from "../components/home/Welcome";
import WorkExperience from "../components/home/WorkExperience";

export default function Home(): JSX.Element {
  return (
    <Layout title={"home"} description="Hello! Welcome to my digital garden">
      <main className="flex flex-col justify-between min-h-screen-minus-navbar p-10">
        <div className="grid lg:grid-cols-7 grid-cols-1 gap-x-10 gap-y-5">
          <WelcomeSection />
          <WorkExperience />
          <EducationSection />
          <ProjectsSection />
        </div>
        <LitFooter />
      </main>
    </Layout>
  );
}
