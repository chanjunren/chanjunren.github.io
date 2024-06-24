import PrimaryHeader from "../common/PrimaryHeader";

export default function WelcomeSection() {
  return (
    <section>
      <PrimaryHeader>🍵 welcome</PrimaryHeader>
      <p>
        I'm currently working as a Backend Engineer at{" "}
        <a href="https://www.okx.com" target="_blank">
          OKX
        </a>
      </p>
      <p>
        This space (WIP) serves as a means for me to organise my{" "}
        <a href="/docs/zettelkasten">notes</a> as well as showcase some of my
        projects that I do for fun, have fun exploring!
      </p>
    </section>
  );
}
