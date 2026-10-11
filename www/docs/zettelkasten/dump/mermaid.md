🗓️ 11102026 1200

# mermaid

Every diagram type bundled with mermaid 11.15, rendered with the Rosé Pine Moon theme.

## Flowchart

```mermaid
flowchart LR
  A[idea] --> B{worth it?}
  B -->|yes| C[ship]
  B -->|no| D[note]
  C --> E((done))
  subgraph later
    D -.-> F[revisit]
  end
```

## Sequence

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant A as API
  participant D as DB
  U->>A: GET /notes
  activate A
  A->>D: SELECT *
  D-->>A: rows
  Note over A,D: cached for 60s
  loop every note
    A->>A: render
  end
  A-->>U: 200 OK
  deactivate A
```

## Class

```mermaid
classDiagram
  class Note {
    +String title
    +Date created
    +render() String
  }
  class Tag {
    +String name
  }
  Note "1" --> "*" Tag : has
  Note <|-- Zettel
```

## State

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Review : submit
  Review --> Draft : changes
  Review --> Published : approve
  Published --> [*]
```

## Entity relationship

```mermaid
erDiagram
  NOTE ||--o{ TAG : has
  NOTE {
    string id PK
    string title
    date created
  }
  TAG {
    string name PK
  }
```

## User journey

```mermaid
journey
  title Writing a note
  section Capture
    Jot idea: 5: Me
    Find source: 3: Me
  section Refine
    Link notes: 4: Me
    Publish: 5: Me
```

## Gantt

```mermaid
gantt
  title Site work
  dateFormat YYYY-MM-DD
  axisFormat %m-%d
  tickInterval 1day
  section Mermaid
    Install plugin   :done, a1, 2026-10-11, 1d
    Theme            :active, a2, after a1, 2d
  section Notes
    Migrate diagrams :a3, after a2, 3d
```

## Pie

```mermaid
pie title Time spent
  "Reading" : 40
  "Writing" : 25
  "Coding" : 20
  "Skating" : 10
  "Mahjong" : 5
```

## Quadrant chart

```mermaid
quadrantChart
  title Effort vs impact
  x-axis Low effort --> High effort
  y-axis Low impact --> High impact
  quadrant-1 Plan
  quadrant-2 Do now
  quadrant-3 Skip
  quadrant-4 Delegate
  Mermaid theme: [0.3, 0.7]
  Rewrite site: [0.9, 0.6]
  Fix typo: [0.1, 0.2]
```

## Requirement

```mermaid
requirementDiagram
  requirement fast_render {
    id: 1
    text: diagrams render under 100ms
    risk: medium
    verifymethod: test
  }
  element mermaid_plugin {
    type: plugin
  }
  mermaid_plugin - satisfies -> fast_render
```

## Git graph

```mermaid
gitGraph
  commit
  branch feature
  checkout feature
  commit
  commit
  checkout main
  merge feature
  commit
```

## C4

```mermaid
C4Context
  title Digital garden
  Person(me, "Me", "Writes notes")
  System(site, "Docusaurus site", "Publishes the zettelkasten")
  System_Ext(gh, "GitHub Pages", "Hosts the build")
  Rel(me, site, "Writes")
  Rel(site, gh, "Deploys to")
```

## Mindmap

```mermaid
mindmap
  root((garden))
    backend
      caching
      databases
    frontend
      react
      css
    life
      skating
      finance
```

## Timeline

```mermaid
timeline
  title Site history
  2023 : Docusaurus setup
  2024 : Vaultusaurus graph
  2025 : Tailwind + shadcn
  2026 : Mermaid diagrams
```

## Sankey

```mermaid
sankey-beta
Salary,Rent,1500
Salary,Food,600
Salary,Savings,900
Savings,Index funds,700
Savings,Cash,200
```

## XY chart

```mermaid
xychart-beta
  title "Notes per month"
  x-axis [Jan, Feb, Mar, Apr, May, Jun]
  y-axis "Notes" 0 --> 30
  bar [5, 12, 9, 20, 15, 25]
  line [5, 12, 9, 20, 15, 25]
```

## Block

```mermaid
block-beta
  columns 3
  a["Markdown"] b["Remark"] c["MDX"]
  space d["Mermaid"] space
  a --> b
  b --> c
  c --> d
```

## Packet

```mermaid
packet-beta
  0-15: "Source port"
  16-31: "Destination port"
  32-63: "Sequence number"
  64-95: "Acknowledgment number"
```

## Kanban

```mermaid
kanban
  todo[To do]
    t1[Migrate diagrams]
  doing[In progress]
    t2[Mermaid theme]
  done[Done]
    t3[Install plugin]
```

## Architecture

```mermaid
architecture-beta
  group cloud(cloud)[Cloud]
  service api(server)[API] in cloud
  service db(database)[DB] in cloud
  service disk(disk)[Storage] in cloud
  api:R --> L:db
  db:B --> T:disk
```

## Radar

```mermaid
radar-beta
  title Skills
  axis fe["Frontend"], be["Backend"], ops["Infra"], ds["Data"], ux["Design"]
  curve now["Now"]{4, 3, 2, 2, 3}
  curve goal["Goal"]{4, 4, 4, 3, 4}
  max 5
```

## Treemap

```mermaid
treemap-beta
"Notes"
  "Backend"
    "Caching": 12
    "Databases": 8
  "Frontend"
    "React": 10
    "CSS": 6
```

## Tree view

```mermaid
treeView-beta
    "www"
        "docs"
            "zettelkasten"
        "src"
            "css"
            "pages"
        "docusaurus.config.ts"
```

## Ishikawa

```mermaid
ishikawa-beta
    Slow build
    Code
        Large bundles
        Unused deps
    Tooling
        Cold cache
    Content
        Many notes
        Big images
```

## Venn

```mermaid
venn-beta
  title What makes a good note
  set Atomic
  set Linked
  set Sourced
  union Atomic,Linked["Navigable"]
  union Linked,Sourced["Trustworthy"]
  union Atomic,Sourced["Citable"]
  union Atomic,Linked,Sourced["Evergreen"]
```

## Wardley map

```mermaid
wardley-beta
title Tea Shop Value Chain

anchor Business [0.95, 0.63]
component Cup of Tea [0.79, 0.61]
component Tea [0.63, 0.81]
component Hot Water [0.52, 0.80]
component Kettle [0.43, 0.35]
component Power [0.10, 0.70]

Business -> Cup of Tea
Cup of Tea -> Tea
Cup of Tea -> Hot Water
Hot Water -> Kettle
Kettle -> Power

evolve Kettle 0.62
evolve Power 0.89
```

## Event modeling

```mermaid
eventmodeling

tf 01 ui CartUI
tf 02 cmd AddItem
tf 03 evt ItemAdded
```

---
## References
- https://mermaid.js.org/intro/
