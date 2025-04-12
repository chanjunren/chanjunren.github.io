import MiniSection from "../common/MiniSection";
import PrimaryHeader from "../common/PrimaryHeader";

export default function Work() {
  //
  return (
    <section className="col-span-12">
      <PrimaryHeader>💼 work</PrimaryHeader>
      <MiniSection
        title="Software Engineer II @ OKX"
        subtitle={"06.2022 - Present"}
      />
      <MiniSection
        title="Intern | Software Engineer @ RoboSolutions"
        subtitle={"01.2021 - 02.2022"}
      />
    </section>
  );
}
