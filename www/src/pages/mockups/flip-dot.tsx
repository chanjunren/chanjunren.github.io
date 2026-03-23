import FlipDotDisplay from "@site/src/components/ui/flip-dot-display";
import type { FontStyle } from "@site/src/components/ui/flip-dot-display/font";
import type { StaggerPattern } from "@site/src/components/ui/flip-dot-display";

const TEXTS = ["HOME", "ZETT", "ABOUT"];

const FONT_STYLES: FontStyle[] = ["micro", "square", "classic"];
const STAGGER_PATTERNS: StaggerPattern[] = [
  "diagonal",
  "center",
  "random",
  "column",
];

export default function FlipDotMockups() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--menu-background, #2a273f)",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          color: "var(--menu-foreground, #f8f7f6)",
          fontFamily: "monospace",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        flip-dot mockups
      </h1>

      {FONT_STYLES.map((font) => (
        <div key={font} style={{ marginBottom: "2rem" }}>
          <p
            style={{
              color: "var(--menu-subtle, #908caa)",
              fontFamily: "monospace",
              fontSize: "0.65rem",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {font}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              alignItems: "flex-start",
            }}
          >
            {STAGGER_PATTERNS.map((stagger) => (
              <div key={stagger}>
                <p
                  style={{
                    color: "var(--menu-subtle, #908caa)",
                    fontFamily: "monospace",
                    fontSize: "0.55rem",
                    marginBottom: "0.4rem",
                    opacity: 0.6,
                  }}
                >
                  {stagger}
                </p>
                <FlipDotDisplay
                  texts={TEXTS}
                  font={font}
                  stagger={stagger}
                  dotSize={2}
                  dotGap={1}
                  interval={2000}
                  transitionMs={300}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
