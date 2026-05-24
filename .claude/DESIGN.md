---
version: alpha
name: chanjunren-digital-garden
description: A monospace-first personal site and digital garden built on Docusaurus + Tailwind v4 + Radix/shadcn-ui. The visual identity anchors on the Rose Pine color palette (warm off-white canvas, muted rose primary, lavender text) and full-stack monospace typography (Geist Mono body, JetBrains Mono headings, Cartograph CF code). The result is a quiet, developer-journal aesthetic — like reading someone's well-kept terminal notebook.

colors:
  # --- Canvas & Surfaces ---
  canvas: "#f8f7f6"
  canvas-transparent: "rgba(255, 255, 255, 0.01)"
  gray-transparent: "rgba(86, 82, 110, 0.05)"
  gray-transparent-strong: "rgba(86, 82, 110, 0.1)"

  # --- Rose Pine Palette (Light) ---
  primary: "#d7827e"
  primary-dark: "#cf6964"
  primary-darker: "#cb5c57"
  primary-darkest: "#b63e38"
  primary-light: "#df9b98"
  primary-lighter: "#e3a8a5"
  primary-lightest: "#ebc1bf"

  # --- Text ---
  ink: "#575279"
  ink-light: "#908caa"
  ink-selection: "rgba(144, 140, 170, 0.5)"
  on-dark: "#e0def4"

  # --- Rose Pine Dark (reserved, dark mode disabled) ---
  dark-bg: "#191724"
  dark-surface: "#1f1d2e"
  dark-overlay: "#26233a"
  dark-primary: "#eb6f92"
  dark-gray-transparent: "rgba(82, 79, 103, 0.25)"

  # --- Shadcn/Tailwind Semantic (oklch) ---
  background: "#f8f7f6"
  foreground: "#575279"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  border: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"

  # --- Menu ---
  menu-background: "#f8f7f6"
  menu-foreground: "#575279"
  menu-accent: "rgba(86, 82, 110, 0.08)"
  menu-subtle: "#908caa"
  menu-muted-background: "rgba(86, 82, 110, 0.1)"

  # --- Tag Colors (Rose Pine Dawn) ---
  tag-rose-bg: "#b4637a"
  tag-pine-bg: "#286983"
  tag-foam-bg: "#56949f"
  tag-iris-bg: "#907aa9"
  tag-muted-bg: "#9893a5"

  # --- Code Syntax (Rose Pine) ---
  code-bg-light: "#191724"
  code-bg-dark: "#232136"
  code-text: "#e0def4"
  code-comment: "#908caa"
  code-keyword: "#31748f"
  code-tag: "#9ccfd8"
  code-function: "#ebbcba"
  code-string: "#f6c177"
  code-builtin: "#c4a7e7"
  code-deleted: "#eb6f92"

typography:
  body:
    fontFamily: '"Geist Mono", serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  heading:
    fontFamily: '"JetBrains Mono", serif'
    fontWeight: 400
    letterSpacing: 0
  h1:
    fontSize: 1.7rem
  h2:
    fontSize: 1.5rem
  h3:
    fontSize: 1.3rem
  code:
    fontFamily: '"Cartograph CF", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontSize: 14px
    fontWeight: 500
  nav:
    fontSize: 14px
    fontWeight: 500
    letterSpacing: tight

rounded:
  sm: "calc(0.625rem - 4px)"
  md: "calc(0.625rem - 2px)"
  lg: "0.625rem"
  xl: "calc(0.625rem + 4px)"
  pill: "9999px"
  full: "9999px"

spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  page-gap: 40px
  page-bottom: 112px
  page-px: 28px

breakpoints:
  lg: 996px

components:
  page-layout:
    wrapperClass: "flex flex-col min-h-screen-minus-navbar items-center gap-10 pb-28 px-7"
    mainClass: "lg:max-w-6xl w-full grow"
  floating-menu:
    position: "fixed bottom-5 left-1/2 -translate-x-1/2"
    backgroundColor: "{colors.menu-background}"
    rounded: "{rounded.xl}"
    padding: 8px
    border: "1px solid var(--border)"
    shadow: "shadow-sm"
  button-default:
    height: 36px
    padding: "8px 16px"
    rounded: "{rounded.md}"
    fontSize: 14px
    fontWeight: 500
  button-outline:
    border: "1px solid var(--border)"
    shadow: "shadow-xs"
  button-ghost:
    backgroundColor: transparent
    hover: "bg-accent"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    border: "1px solid var(--border)"
    padding: "24px"
    shadow: "shadow-sm"
  custom-tag:
    rounded: "rounded"
    padding: "2px 6px 4px 6px"
    fontSize: 16px
    letterSpacing: tight
    shadow: "button-shadow"
    opacity: 0.4
  code-block:
    backgroundColor: "{colors.code-bg-light}"
    textColor: "{colors.code-text}"
    fontFamily: "{typography.code.fontFamily}"
    lineHeight: 1.5
    tabSize: 4
    inlinePadding: "0.1em"
    inlineRadius: "0.3em"
  navbar:
    height: "3.5rem"
    padding: "1rem"
    gap: "1rem"
    titleSize: "1.4rem"
    itemRadius: "0.5rem"
    itemPadding: "0.25rem 0.8rem"
    itemColor: "rgba(150, 150, 150, 0.5)"
    activeBackground: "{colors.gray-transparent}"
    desktopBlur: "blur(10px)"
    desktopBg: "{colors.canvas-transparent}"
    hiddenOnDesktop: true
  tooltip:
    rounded: "{rounded.md}"
    padding: "6px 12px"
    shadow: "shadow-md"
---

## Overview

This is a personal digital garden and portfolio — a Docusaurus site themed with Rose Pine, styled via Tailwind CSS v4, and assembled from Radix/shadcn-ui primitives. The defining visual decision is **monospace everything**: Geist Mono for body text, JetBrains Mono for headings, Cartograph CF for code blocks. The site reads like a well-organized developer notebook rather than a marketing page.

The canvas is a **warm off-white** (`{colors.canvas}` — #f8f7f6), text is a **muted purple-ink** (`{colors.ink}` — #575279), and the primary accent is a **soft rose** (`{colors.primary}` — #d7827e) from the Rose Pine Dawn palette. Code blocks invert to the **Rose Pine dark** surface (`{colors.code-bg-light}` — #191724) regardless of page theme.

Navigation lives in a **floating bottom menu** — a pill-shaped bar fixed to the bottom center of the viewport, holding page links and external links with animated hover icons (snowboarding mouse, paper plane, etc.). The Docusaurus top navbar is hidden on desktop and only used as a hamburger menu on mobile.

**Key Characteristics:**
- Monospace-first typography — every surface uses a monospace font. This is the brand voice.
- Rose Pine Dawn palette — warm off-white canvas, muted purple text, soft rose accents.
- Floating bottom navigation with playful icon hover animations.
- Code blocks always render on Rose Pine dark background with Cartograph CF.
- Tags use Rose Pine semantic colors (rose, pine, foam, iris, muted) at 40% opacity with an inset button shadow.
- Minimal elevation — cards use thin borders + `shadow-sm`, not heavy drop shadows.
- Light mode only (dark mode switch disabled, though dark mode CSS vars are defined for future use).

## Colors

### Canvas & Surface
- **Canvas** (`{colors.canvas}` — #f8f7f6): The page floor. Warm off-white, never pure white. Shared with the menu background.
- **Gray Transparent** (`{colors.gray-transparent}` — rgba(86, 82, 110, 0.05)): Hover backgrounds on navbar items, active states, simple card fills.
- **Gray Transparent Strong** (`{colors.gray-transparent-strong}` — rgba(86, 82, 110, 0.1)): Slightly stronger version for muted backgrounds.

### Text
- **Ink** (`{colors.ink}` — #575279): Default text color for all body and heading content. A warm purple-gray, distinctly not black.
- **Ink Light** (`{colors.ink-light}` — #908caa): Muted text — subtitles, menu subtle labels, code comments.
- **Selection** (`{colors.ink-selection}` — rgba(144, 140, 170, 0.5)): Text selection highlight with white foreground.

### Primary (Rose)
- **Primary** (`{colors.primary}` — #d7827e): The Rose Pine "love" color. Used for Docusaurus link highlights, active states, and inline accents. Not a CTA button color — the site doesn't have marketing-style CTAs.
- Darker and lighter variants follow a 7-step scale from `#b63e38` (darkest) to `#ebc1bf` (lightest).

### Tag Colors
Tags draw from Rose Pine Dawn's named palette at 40% background opacity:
- **Rose** (`{colors.tag-rose-bg}` — #b4637a): For topics like design, personal.
- **Pine** (`{colors.tag-pine-bg}` — #286983): For infrastructure, backend topics.
- **Foam** (`{colors.tag-foam-bg}` — #56949f): For frontend, tooling topics.
- **Iris** (`{colors.tag-iris-bg}` — #907aa9): For AI, research topics.
- **Muted** (`{colors.tag-muted-bg}` — #9893a5): Default/uncategorized.

### Code Syntax (Rose Pine)
Code blocks always use the Rose Pine dark theme regardless of page mode:
- Background: `#191724` (light mode) / `#232136` (dark mode)
- Text: `#e0def4` (lavender white)
- Comments: `#908caa` (muted)
- Keywords: `#31748f` (pine blue)
- Tags/Classes: `#9ccfd8` (foam cyan)
- Functions: `#ebbcba` (rose warm)
- Strings: `#f6c177` (gold)
- Builtins: `#c4a7e7` (iris purple)
- Deleted: `#eb6f92` (love pink)

### Shadcn Semantic
The shadcn/Tailwind layer uses oklch values for component-level tokens:
- `--border`: oklch(0.922 0 0) — light gray borders
- `--ring`: oklch(0.708 0 0) — focus ring
- `--muted`: oklch(0.97 0 0) — muted surface
- `--destructive`: oklch(0.577 0.245 27.325) — error/destructive actions

## Typography

### Font Stack
The entire site runs monospace fonts. This is intentional and unbreakable.

| Role | Font | Fallback | Use |
|---|---|---|---|
| Body | Geist Mono | serif | All body text, UI labels, buttons, navigation |
| Headings | JetBrains Mono | serif | h1, h2, h3 in markdown and page headers |
| Code | Cartograph CF | ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas | Code blocks and inline code |

### Scale
Base font size is set to **82%** of the Infima/Docusaurus default — deliberately compact.

| Element | Size | Notes |
|---|---|---|
| h1 | 1.7rem | Markdown first heading |
| h2 | 1.5rem | Section headings |
| h3 | 1.3rem | Sub-section headings |
| Body | 1rem (at 82% base) | ~13px effective |
| Button/Nav | 14px | `text-sm` equivalent |
| Caption/Tag | 13-16px | Tags use `text-md` |

### Principles
- All fonts are monospace. Never introduce a proportional sans-serif or serif for body or headings.
- Headings use regular weight (400), not bold. The monospace character already provides enough visual distinction.
- `tracking-tight` on tags and nav items for a slightly condensed feel.
- Buttons use `font-medium` (500) for emphasis within the monospace voice.

## Layout

### Page Structure
Every page wraps in the `<Page>` component:
- Wrapper: `flex flex-col min-h-screen-minus-navbar items-center gap-10 pb-28 px-7`
- Main: `lg:max-w-6xl w-full grow`
- Footer: `<LitFooter />` (minimal)
- Menu: `<FloatingMenu />` (fixed bottom center)

The `pb-28` (112px) bottom padding ensures content never hides behind the floating menu.

### Navigation
- **Desktop**: Top navbar is hidden (`display: none` at >= 996px). Navigation lives entirely in the floating bottom menu.
- **Mobile**: Docusaurus hamburger navbar appears at < 996px, floating menu still present.
- **Floating menu**: Fixed at `bottom-5 left-1/2 -translate-x-1/2`. Background matches canvas. Contains page links (Home, Notes, About) + external links (GitHub, LinkedIn, Resume) separated by a vertical divider.

### Grid
- Doc content column: `max-width: 60%` on desktop.
- TOC sidebar: `--ifm-col-width: 33%`.
- Project/gallery grids: `grid grid-cols-12` with responsive gaps.

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 996px | Hamburger navbar visible; single-column layouts; floating menu still shown |
| Desktop | >= 996px | Navbar hidden; floating menu is sole navigation; doc content capped at 60% width |

## Elevation & Depth

The system is nearly flat. Depth comes from subtle borders and minimal shadows.

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Page body, sections |
| Hairline border | 1px `{colors.border}` | Cards, inputs, floating menu |
| Shadow XS | `shadow-xs` | Outline buttons |
| Shadow SM | `shadow-sm` | Cards, floating menu |
| Shadow MD | `shadow-md` | Hover cards, tooltips, simple cards |
| Shadow LG | `shadow-lg` | Dialogs |
| Inset button shadow | `inset 0 0 0 1px rgba(0,0,0,.1), inset 0 -2px 0 1px rgba(0,0,0,.1)` | Tags (custom `button-shadow` class) |

### Special Effects
- **Desktop navbar**: `backdrop-filter: blur(10px)` with near-transparent background — glass effect (but navbar is hidden on desktop, so this only applies if re-enabled).
- **No decorative shadows** — the site avoids box-shadow as a design element.

## Border Radius

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | ~2.5px | KBD elements |
| `{rounded.md}` | ~4.5px | Buttons, inputs, navbar items, tooltips |
| `{rounded.lg}` | 10px | Cards (via `--radius`) |
| `{rounded.xl}` | 14px | Floating menu, card wrapper |
| `{rounded.pill}` | 9999px | Not currently used, reserved |

The base `--radius` is 0.625rem (10px). All other radii derive from it.

## Components

### Floating Menu
The signature UI element. A bottom-fixed pill bar holding all navigation.
- Position: `fixed bottom-5 left-1/2 -translate-x-1/2`
- Background: `{colors.menu-background}` (canvas)
- Border: `1px solid var(--border)`
- Shadow: `shadow-sm`
- Rounded: `{rounded.xl}` (14px)
- Padding: `p-2`
- Contains: NavigationMenu with icon links, each with Tooltip and hover-triggered animated SVG icons.
- Divider: `h-5 w-px bg-(--menu-subtle)/40 mx-1` between page links and external links.

### Buttons (CVA Variants)
All buttons: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all`.

| Variant | Background | Text | Border | Shadow |
|---|---|---|---|---|
| default | `bg-primary` | `text-primary-foreground` | none | none |
| outline | `bg-(--background)` | inherits | `border` | `shadow-xs` |
| ghost | transparent | inherits | none | none |
| secondary | `bg-secondary` | `text-secondary-foreground` | none | none |
| destructive | `bg-destructive` | white | none | none |
| link | transparent | `text-primary` | none | none |

Sizes: default `h-9 px-4 py-2`, sm `h-8 px-3`, lg `h-10 px-6`, icon `size-9`.

### Cards
Standard shadcn card: `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`.
- Header: grid layout with auto-rows, `gap-2`, `px-6`.
- Content: `px-6`.
- Footer: `flex items-center px-6`.
- Simple card variant: `rounded-md bg-[var(--gray-transparent-bg)] shadow-md flex-grow`.

### Custom Tags
Rose Pine-colored pill labels using the `CustomTag` component.
- Background: Rose Pine color at 40% opacity (`bg-[color]/40`)
- Text: Darker shade of the same hue family
- Radius: `rounded` (default 4px)
- Padding: `px-1.5 pt-0.5 pb-1`
- Shadow: `button-shadow` (inset border effect)
- Tracking: `tracking-tight`

### Code Blocks
Always Rose Pine dark, regardless of page theme.
- Background: `#191724` (light) / `#232136` (dark)
- Font: Cartograph CF stack
- Line height: 1.5
- Tab size: 4
- Inline code: `padding: 0.1em`, `border-radius: 0.3em`
- Selection: `#403d52` (light) / `#44415a` (dark)
- Line highlight: background `#403d52` with `inset 5px 0 0 #e0def4` left border

### Tooltip
Radix Tooltip with `delay=0`, `rounded-md`, `shadow-md`, `px-3 py-1.5`.

### Dialog
Radix Dialog with overlay backdrop, `rounded-lg`, `shadow-lg`, fade + zoom animations.

## Animations

### Custom Keyframes
- **typewriter**: `width: 0 -> 100%` in steps, used with border blink cursor effect.
- **borderBlink**: Border-right opacity toggles at 50% — the blinking cursor.
- **handwave**: Rotate -17deg -> 0deg -> -17deg — greeting wave animation.

### Radix State Animations
Dialogs, hover cards, and tooltips use Radix data-state attributes:
- Open: `fade-in-0`, `zoom-in-95`
- Close: `fade-out-0`, `zoom-out-95`
- Slide direction: `slide-in-from-top-2`, `slide-in-from-bottom-2`, etc.

### Hover Icon Animations
Menu icons have per-icon character animations triggered by hover state (shake, jump, spin, pop, snowboard ollie). These are defined in component-scoped CSS modules following the animation style guide.

### Transitions
- Buttons: `transition-all`
- Navbar items: `transition: background-color 100ms linear`
- General interactive elements: short, functional transitions — no decorative motion.

## Do's and Don'ts

### Do
- Use monospace fonts for everything. Geist Mono for body, JetBrains Mono for headings.
- Keep the warm off-white canvas (`#f8f7f6`). Pure white breaks the Rose Pine atmosphere.
- Use the Rose Pine palette for all color decisions. Tag colors come from the Dawn variant.
- Keep elevation minimal — thin borders and `shadow-sm` for cards, not heavy box shadows.
- Place new navigation items in the floating bottom menu, not in a top bar.
- Use shadcn/Radix primitives for interactive components. Compose with CVA for variants.
- Keep code blocks on the dark Rose Pine surface regardless of page theme.
- Use `cn()` (clsx + tailwind-merge) for all className composition.

### Don't
- Don't introduce proportional fonts (sans-serif or serif) for body or headings. The monospace voice is the identity.
- Don't use bold (700) for headings. Regular weight monospace is sufficient.
- Don't add heavy shadows or glass morphism effects.
- Don't enable dark mode for the page — it's disabled intentionally (code blocks already provide dark contrast).
- Don't use the primary rose color for large surface fills. It's an accent, not a background.
- Don't add a traditional top navigation bar on desktop. The floating menu is the sole nav.
- Don't use `transition: all` on elements with many properties — specify the animated property.
- Don't install animation libraries (Framer Motion, GSAP). CSS + SMIL + component-scoped modules.

## Dependencies & Tooling

| Package | Role |
|---|---|
| Docusaurus 3.10 | Static site framework |
| Tailwind CSS v4 | Utility-first styling via PostCSS plugin |
| Radix UI | Headless component primitives |
| shadcn/ui | Pre-composed Radix components with Tailwind |
| CVA (class-variance-authority) | Component variant management |
| clsx + tailwind-merge | `cn()` utility for className composition |
| Lucide React | Icon library |
| tw-animate-css | Animation utility classes |
| @react-three/fiber | 3D experiments (project showcases) |
| Recharts | Chart components |

## File Structure (Design-Relevant)

```
src/
  css/
    index.css              # Font imports, Infima overrides, global utilities
    shadcn.css             # Tailwind theme, CSS variables, keyframes
    docusaurus-rose-pine.css  # Docusaurus color overrides (light + dark)
    prism-rose-pine.css    # Code block syntax theme + heading sizes
    search.css             # Search component styles
  components/
    ui/                    # Shadcn/Radix components (button, card, dialog, etc.)
    home/
      floatingmenu/        # Bottom nav + animated icons
    projects/              # Project showcase components
    spotlight/             # Gallery components
  lib/
    utils.ts               # cn() utility
  theme/                   # Docusaurus theme overrides (Navbar, TOC)
```

## Known Gaps

- Dark mode CSS variables are defined but the mode switch is disabled. Re-enabling would need visual QA across all components.
- The `muted` tag color has a double-hash typo in `custom-tag.tsx` (`bg-[##9893a5]/40`).
- Scrollbar styling only covers `.theme-doc-sidebar-container`, not the main page scrollbar.
- Chart colors (5 oklch stops) are defined in shadcn.css but not documented as a formal palette.
- The floating menu hides the Docusaurus navbar on desktop but both appear on mobile — potential redundancy.
- Font loading relies on Google Fonts CDN for Geist Mono and JetBrains Mono; Cartograph CF is expected to be locally installed.
