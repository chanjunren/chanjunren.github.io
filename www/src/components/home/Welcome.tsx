export default function WelcomeSection() {
  return (
    <section className="md:col-span-7 col-span-12">
      <header className="text-3xl mb-2">
        <span className="text-[var(--ifm-color-emphasis-400)]">#</span> Welcome
      </header>
      <p>
        Hi there! I'm Jun Ren, currently a Backend Engineer working at{" "}
        <a href="https://www.okx.com" target="_blank">
          OKX
        </a>
      </p>
      <p>
        This space serves a collection of my personal notes and side projects
      </p>
      <p>Have fun exploring!</p>
    </section>
  );
}
