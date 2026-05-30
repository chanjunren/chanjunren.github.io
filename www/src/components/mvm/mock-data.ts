import { ModelInfo, ModelResult } from "@site/src/types/mvm";

export const MOCK_MODELS: ModelInfo[] = [
  { alias: "haiku-3.5", name: "Haiku 3.5", description: "Legacy fast model" },
  { alias: "haiku-4.5", name: "Haiku 4.5", description: "Latest fast model" },
  { alias: "sonnet-3.5", name: "Sonnet 3.5", description: "Legacy balanced model" },
  { alias: "sonnet-4.5", name: "Sonnet 4.5", description: "Balanced speed and quality" },
  { alias: "sonnet-4.6", name: "Sonnet 4.6", description: "Latest balanced model" },
  { alias: "opus-3.5", name: "Opus 3.5", description: "Legacy most capable model" },
  { alias: "opus-4.6", name: "Opus 4.6", description: "Latest most capable model" },
];

export const MOCK_PROMPT = "Explain monads in 3 sentences";

const HAIKU_TEXT = `A monad is a design pattern in functional programming that wraps values in a computational context, providing a structured way to chain operations together.

It follows three laws — **left identity**, **right identity**, and **associativity** — ensuring predictable composition through two core operations:

- \`unit\` — wrapping a value
- \`bind\` — transforming the wrapped value while preserving context

Common examples include \`Maybe\` for nullable values, \`Either\` for error handling, and \`IO\` for side effects.`;

const SONNET_TEXT = `A monad is an abstraction that lets you **sequence computations** while automatically handling some underlying concern — like missing values, errors, or asynchronous operations.

Technically, it's any type that implements two operations:

1. \`return\` (also called \`unit\` or \`pure\`) — wraps a plain value into the monadic context
2. \`bind\` (\`>>=\`) — chains a function over the wrapped value, threading context through each step

\`\`\`haskell
-- The Maybe monad handling nullable values
safeDivide :: Int -> Int -> Maybe Int
safeDivide _ 0 = Nothing
safeDivide x y = Just (x \`div\` y)

result = Just 10 >>= safeDivide 100 >>= safeDivide 2
-- result = Just 5
\`\`\`

The power comes from the **monad laws** which guarantee that chaining operations behaves predictably — making monads the functional programmer's equivalent of a *programmable semicolon*.`;

const OPUS_TEXT = `A monad is a mathematical structure borrowed from category theory that, in programming, provides a principled way to encapsulate and compose computations with effects.

### Core Operations

At its core, a monad for a type constructor \`M\` requires:

| Operation | Signature | Purpose |
|-----------|-----------|---------|
| \`return\` | \`a → M a\` | Lift a pure value into context |
| \`bind\` | \`M a → (a → M b) → M b\` | Sequence with a context-producing function |

These are subject to three laws ensuring associativity and identity.

### Why It Matters

The real insight is that monads let you write code that *looks* sequential and imperative while remaining purely functional:

\`\`\`haskell
-- do-notation desugars to bind chains
main :: IO ()
main = do
  name <- getLine          -- IO monad handles side effects
  let greeting = "Hello, " ++ name
  putStrLn greeting        -- looks imperative, is purely functional
\`\`\`

Each \`bind\` step decides **how** (or **whether**) to pass a value forward, which is why Haskell's \`do\`-notation can express loops, early returns, and exception handling without any of those being language primitives.`;

const HAIKU_SHORT = `A monad wraps a value in context and gives you \`return\` to wrap and \`bind\` to chain — that's it.

Think \`Maybe\` for nulls, \`Either\` for errors, \`IO\` for side effects.`;

const SONNET_SHORT = `Monads are chainable containers. You put a value in with \`return\`, transform it with \`bind\`, and the container handles the plumbing (nulls, errors, async, etc.).

The three monad laws keep composition predictable.`;

function mockResult(text: string, tokens: number, ms: number, cost: number): ModelResult {
  return {
    text,
    status: "done",
    usage: { input_tokens: 12, output_tokens: tokens, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
    duration_ms: ms,
    total_cost_usd: cost,
  };
}

export const MOCK_RESULTS: Record<string, ModelResult> = {
  "haiku-3.5": mockResult(HAIKU_SHORT, 68, 1200, 0.0008),
  "haiku-4.5": mockResult(HAIKU_TEXT, 127, 2340, 0.0018),
  "sonnet-3.5": mockResult(SONNET_SHORT, 72, 3100, 0.005),
  "sonnet-4.5": mockResult(SONNET_TEXT, 198, 5870, 0.012),
  "sonnet-4.6": mockResult(SONNET_TEXT, 195, 5420, 0.011),
  "opus-3.5": mockResult(OPUS_TEXT, 220, 18200, 0.072),
  "opus-4.6": mockResult(OPUS_TEXT, 231, 14520, 0.058),
};

export const MOCK_RESULTS_STREAMING: Record<string, ModelResult> = {
  "haiku-3.5": mockResult(HAIKU_SHORT, 68, 1200, 0.0008),
  "haiku-4.5": mockResult(HAIKU_TEXT, 127, 2340, 0.0018),
  "sonnet-3.5": { text: "Monads are chainable containers. You put a value in with `return`", status: "streaming" },
  "sonnet-4.5": { text: "A monad is an abstraction that lets you **sequence computations**", status: "streaming" },
  "sonnet-4.6": { text: "A monad is an abstraction that lets you **sequence computations** while automatically handling some underlying concern", status: "streaming" },
  "opus-3.5": { text: "", status: "streaming" },
  "opus-4.6": { text: "", status: "streaming" },
};

export const MOCK_RESULTS_ERROR: Record<string, ModelResult> = {
  "haiku-3.5": mockResult(HAIKU_SHORT, 68, 1200, 0.0008),
  "haiku-4.5": mockResult(HAIKU_TEXT, 127, 2340, 0.0018),
  "sonnet-3.5": mockResult(SONNET_SHORT, 72, 3100, 0.005),
  "sonnet-4.5": mockResult(SONNET_TEXT, 198, 5870, 0.012),
  "sonnet-4.6": mockResult(SONNET_TEXT, 195, 5420, 0.011),
  "opus-3.5": { text: "", status: "error", error: "request timed out" },
  "opus-4.6": { text: "", status: "error", error: "request timed out" },
};
