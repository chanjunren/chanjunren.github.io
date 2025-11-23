import MiniSection from "../common/MiniSection";
import CustomTag from "../ui/CustomTag";

export default function Work() {
  return (
    <section className="col-span-6">
      <CustomTag
        color="foam"
        className="text-lg tracking-tighter! justify-self-center! mb-5"
      >
        WORK | EDUCATION
      </CustomTag>
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
