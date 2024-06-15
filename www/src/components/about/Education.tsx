import MiniSection from "../common/MiniSection";
import PrimaryHeader from "../common/PrimaryHeader";

export default function Education() {
  return (
    <section>
      <PrimaryHeader>📖 Education</PrimaryHeader>
      <MiniSection
        title="National University of Singapore"
        subtitle={"06.2018 - 06.2022"}
      >
        <span>🎮 Bachelor of Computing (Honours), Computer Science</span>
        <span>🐽 Grade: Distinction</span>
        <span>🥦 President of NUS Skating Club</span>
      </MiniSection>
    </section>
  );
}
