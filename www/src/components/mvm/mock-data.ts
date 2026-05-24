import { ModelInfo, ModelResult } from "@site/src/types/mvm";

export const MOCK_MODELS: ModelInfo[] = [
  {
    alias: "haiku",
    name: "Claude Haiku",
    description: "Fastest, cheapest. Good for simple tasks.",
  },
  {
    alias: "sonnet",
    name: "Claude Sonnet",
    description: "Balanced speed and quality.",
  },
  {
    alias: "opus",
    name: "Claude Opus",
    description: "Most capable. Slower, higher cost.",
  },
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

export const MOCK_RESULTS: Record<string, ModelResult> = {
  haiku: {
    text: HAIKU_TEXT,
    status: "done",
    usage: {
      input_tokens: 12,
      output_tokens: 127,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    duration_ms: 2340,
    total_cost_usd: 0.0018,
  },
  sonnet: {
    text: SONNET_TEXT,
    status: "done",
    usage: {
      input_tokens: 12,
      output_tokens: 198,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    duration_ms: 5870,
    total_cost_usd: 0.012,
  },
  opus: {
    text: OPUS_TEXT,
    status: "done",
    usage: {
      input_tokens: 12,
      output_tokens: 231,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    duration_ms: 14520,
    total_cost_usd: 0.058,
  },
};

export const MOCK_RESULTS_STREAMING: Record<string, ModelResult> = {
  haiku: {
    text: HAIKU_TEXT,
    status: "done",
    usage: {
      input_tokens: 12,
      output_tokens: 127,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
    duration_ms: 2340,
    total_cost_usd: 0.0018,
  },
  sonnet: {
    text: "A monad is an abstraction that lets you **sequence computations** while automatically handling some underlying concern — like missing values, errors, or asynchronous operations.\n\nTechnically, it's any type that implements two operations:\n\n1. `return` (also called `unit` or `pure`) — wraps a plain value into",
    status: "streaming",
  },
  opus: {
    text: "",
    status: "streaming",
  },
};

export const MOCK_RESULTS_ERROR: Record<string, ModelResult> = {
  haiku: { ...MOCK_RESULTS.haiku },
  sonnet: { ...MOCK_RESULTS.sonnet },
  opus: {
    text: "",
    status: "error",
    error: "request timed out",
  },
};
