import PrimaryHeader from "../common/PrimaryHeader";
import useGallery from "./hooks/useGallery";

export default function WelcomeSection() {
  const { selectedProject } = useGallery();
  return (
    <section className={selectedProject ? "hidden" : ""}>
      <PrimaryHeader>🍵 welcome</PrimaryHeader>
      <p>
        This space serves as a means for me to organise my{" "}
        <a href="/docs/zettelkasten">notes</a> as well as showcase some of my
        projects that I do for fun, have fun exploring!
      </p>
    </section>
  );
}
