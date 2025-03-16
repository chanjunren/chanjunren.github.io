import MiniSection from "../common/MiniSection";
import PrimaryHeader from "../common/PrimaryHeader";

export default function Education() {
  return (
    <section className="mt-14">
      <PrimaryHeader className="justify-self-center">
        📖 Education
      </PrimaryHeader>
      <MiniSection
        title="National University of Singapore"
        subtitle={"06.2018 - 06.2022"}
      >
        <span>Bachelor of Computing (Honours), Computer Science</span>
      </MiniSection>
    </section>
  );
}
