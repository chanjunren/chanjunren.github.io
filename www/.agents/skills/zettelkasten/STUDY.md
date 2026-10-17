# Study notes

A study note should leave the reader able to explain how the thing works.

## Shape of a note

- Open with what it is and why it matters, in plain language.
- Give the mental model next, before any formulas, commands, or code.
- Explain the mechanism (see below).
- Add one small worked example if it clears up a likely confusion.
- Call out boundaries and common misreadings.
- Finish with formulas, commands, code, and edge cases.

Define each term the first time it appears. If it needs more than a line, link to its own note.

## Explaining a mechanism

- Walk the causal path: trigger -> mechanism -> state or output -> consequence.
- Say which component owns each step and where it hands off to the next.
- When it helps, trace one real path from start to finish.
- Keep details that explain behaviour, limits, or failure modes. Drop trivia.
- Tie each idea to something the reader can observe.
- Use prose to explain cause and effect. Use lists for things to scan.

## Diagrams

Docusaurus renders fenced `mermaid` blocks.

- Add one when a flow, sequence, or state change is easier to see than read.
- Keep it to one question, with labels that name real components or states.
- Explain the important path in prose next to it. Skip it if it only repeats the prose.
