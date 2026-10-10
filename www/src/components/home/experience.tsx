import MiniSection from "@site/src/components/ui/mini-section";
import { SplitFlap } from "@site/src/components/ui/split-flap";

export default function Work() {
  return (
    <section className="col-span-6">
      <SplitFlap flipIn value="EXPERIENCE" className="mb-5 text-lg" />
      <MiniSection
        title="Software Engineer II @ OKX"
        subtitle={"06.2022 - Present"}
      />
      <MiniSection
        title="Intern | Software Engineer @ RoboSolutions"
        subtitle={"01.2021 - 02.2022"}
      />
      <MiniSection
        title="National University of Singapore"
        subtitle={"06.2018 - 06.2022"}
      >
        <span>Bachelor of Computing (Honours), Computer Science</span>
      </MiniSection>
    </section>
  );
}
