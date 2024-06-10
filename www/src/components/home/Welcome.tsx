import PrimaryHeader from "../common/PrimaryHeader";

export default function WelcomeSection() {
  return (
    <section className="col-span-2">
      <PrimaryHeader>🍵 welcome</PrimaryHeader>
      <p>
        This space serves as a means for me to organise my{" "}
        <a href="/docs/zettelkasten">notes</a> as well as showcase some of my
        projects that I do for fun, have fun exploring!
      </p>
    </section>
  );
}
