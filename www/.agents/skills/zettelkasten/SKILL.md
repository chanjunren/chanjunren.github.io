---
name: zettelkasten
description: Create, revise, split, link, and organize notes under docs/zettelkasten. Use when working on this repo's learning notes, cheatsheets, subject maps, or wiki links.
---

# Zettelkasten

Write notes that answer a real learning or lookup need. Don't preserve structure that obscures the subject.

## Before editing

1. Read the target note and its neighbours in the same directory.
2. Search the whole Zettelkasten before adding a note or link.
3. Pick the note type, then read its guide:
   - **Study note** (default) -> [STUDY.md](STUDY.md)
   - **Cheatsheet** -> optimize for scanning and copy/paste. Group by task, tables for repeated fields, minimal prose. Keep safety warnings.
4. Reorganizing several notes in a subject -> [COLLECTION.md](COLLECTION.md).

## Structure

- Start from `docs/templates/zettel.md`: `🗓️ DDMMYYYY HHmm`, one H1, content, `## References`.
- H1 is snake_case and matches the filename.
- Organize by directory and links. No tags.
- One concept per note. Split when sections have different goals or reasons to revisit.
- H2 and H3 only. Prefer H3 subsections over bolded list items.
- Name headings after the idea, not generic "Why" or "When".

## Links

- Link only a prerequisite, a meaningful contrast, or a logical next step.
- Weave links into sentences: "See [[other_note]] for X". No "Related concepts" section, no "because…" after a link.
- Use `[[filename_without_extension]]`. Verify the target exists and its basename is unique.

## Style

- Lead with the point. Plain language, short sentences, point form.
- Bold a key term on first mention.
- At most two admonitions (`ad-warning`, `ad-danger`, `ad-example`), 1-2 sentences each.
- Cut filler sections, repeated definitions, and examples that don't teach.

## Accuracy

- Verify version-dependent or nuanced claims against primary docs. Cite them under `## References`.
- Separate exact definitions from useful approximations.
- Never invent a wiki target, command output, metric, label, or source.
