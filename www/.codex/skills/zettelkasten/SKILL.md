---
name: zettelkasten
description: Create, revise, split, connect, audit, and organize Markdown notes under docs/zettelkasten. Use when Codex works on this repository's learning notes, study guides, cheatsheets, concept maps, reading paths, wiki links, or note-quality improvements. Optimize study notes for conceptual understanding and cheatsheets for fast lookup while preserving the repository's Zettelkasten conventions.
---

# Zettelkasten

Create notes that answer a real learning or reference need. Do not preserve existing structure when it obscures the subject.

## Inspect before editing

1. Read the target notes and nearby notes in the same subject.
2. Read `docs/templates/zettel.md` and `docs/zettelkasten/README.md` when changing conventions or structure.
3. Search the whole Zettelkasten before adding a note or wiki link.
4. Identify the intended note type: study material or cheatsheet.
5. For a multi-note subject, identify prerequisites, overlaps, missing bridge concepts, and the reader's practical questions before editing.

## Structure notes

- Start with `🗓️ DDMMYYYY HHmm`, then one H1 whose snake_case text matches the filename.
- Use directory placement and links for organization. Do not add tags.
- Keep one central concept per note. Split a note when its sections have different learning goals or independent reasons to revisit them.
- Use only H2 and H3 headings.
- End with `## References`.
- Prefer a small map or reading-path note for a subject with several prerequisites. Do not turn every relationship into a new note.

## Write study material

- Lead with a plain-language definition and why the concept matters.
- Give the mental model before formulas, commands, or implementation details.
- Define each necessary term on first use. Link to a dedicated note when the term needs its own explanation.
- Connect abstractions to observable consequences: what the reader sees, why it changes, and what conclusion is safe.
- Use one compact worked example when it resolves likely confusion.
- Explain important boundaries and common misreadings. Avoid encyclopedic detail.
- Put formulas, commands, code, and edge cases after the explanation they support.

For observability notes, prefer this reasoning chain when relevant:

`system mechanism → exporter measurement → metric type and labels → PromQL transformation → panel meaning → diagnostic action`

State what a metric does not prove. Separate symptoms, causes, and decisions.

## Write cheatsheets

- Optimize for scanning and copy/paste.
- Group syntax or commands by task.
- Use tables for repeated fields and short examples for common patterns.
- Keep prose minimal, but retain safety warnings and assumptions needed to use an entry correctly.

## Link notes

- Add a wiki link only for a prerequisite, a meaningful contrast, or a logical next step.
- Weave links into sentences. Do not add a generic related-concepts section.
- Use `[[filename_without_extension]]` and verify the target exists.
- Avoid explanations such as “because it is related” after a link.
- Check new or changed links across the entire Zettelkasten; duplicate basenames make links ambiguous.

## Use style deliberately

- Lead with the point.
- Prefer plain language, short sentences, and concrete nouns.
- Bold a key term on first mention when it helps scanning.
- Use natural headings that name the idea.
- Use at most two concise admonitions per note: `ad-warning`, `ad-danger`, or `ad-example`.
- Remove filler sections, repeated definitions, decorative separators, and examples that do not teach the concept.

## Verify accuracy

- Verify claims that depend on current software behavior or nuanced system semantics against primary documentation.
- Cite complex or non-obvious claims under `## References`.
- Distinguish an exact definition from a useful approximation.
- Check metric names and labels against the actual exporter or application version when available.
- Never invent a wiki target, command result, metric, label, or source.

## Improve a collection

1. Inventory notes by purpose, size, inbound/outbound links, and overlap.
2. Define the reader outcome and a dependency-ordered reading path.
3. Create missing foundation or bridge notes before polishing advanced leaves.
4. Revise in vertical slices: concept → metric → query → interpretation.
5. Consolidate duplicate explanations and keep one canonical definition.
6. Add or update a subject map that tells the reader where to start and what they will learn.
7. Validate filenames, H1s, wiki targets, references, and site build.

Do not measure quality by note count or detail. A collection is useful when a reader can explain the big idea, interpret the evidence, and choose the next diagnostic step.
