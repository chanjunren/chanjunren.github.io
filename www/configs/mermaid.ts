import type { UserThemeConfig } from "@docusaurus/theme-mermaid";

// Rosé Pine Moon — https://rosepinetheme.com/palette
const MOON = {
  base: "#232136",
  text: "#e0def4",
  love: "#eb6f92",
  gold: "#f6c177",
  rose: "#ea9a97",
  pine: "#3e8fb0",
  foam: "#9ccfd8",
  iris: "#c4a7e7",
};

/** Mix `color` into the Moon base at `pct`%, like CSS color-mix(). */
const tint = (color: string, pct: number): string => {
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [a, b] = [rgb(MOON.base), rgb(color)];
  const mixed = a.map((c, i) => Math.round(c + (b[i] - c) * (pct / 100)));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

// Neutrals are the text colour mixed into the base, after beautiful-mermaid's theme.ts.
const N = {
  bg: MOON.base,
  text: MOON.text,
  muted: tint(MOON.text, 65),
  outline: tint(MOON.text, 55),
  line: tint(MOON.text, 45),
  arrow: tint(MOON.text, 80),
  rule: tint(MOON.text, 25),
  faint: tint(MOON.text, 14),
  surfaceAlt: tint(MOON.text, 8),
  surface: tint(MOON.text, 4),
  well: tint(MOON.text, 2),
};

// Accents only where a diagram needs to tell series apart.
const SERIES = [
  MOON.iris,
  MOON.foam,
  MOON.rose,
  MOON.gold,
  MOON.pine,
  MOON.love,
];
const at = (i: number) => SERIES[i % SERIES.length];
const indexed = (prefix: string, count: number, color: (i: number) => string) =>
  Object.fromEntries(
    Array.from({ length: count }, (_, i) => [`${prefix}${i}`, color(i)]),
  );
const indexedFrom1 = (
  prefix: string,
  count: number,
  color: (i: number) => string,
) =>
  Object.fromEntries(
    Array.from({ length: count }, (_, i) => [`${prefix}${i + 1}`, color(i)]),
  );

const C4_ELEMENTS = [
  "person",
  "system",
  "system_db",
  "system_queue",
  "container",
  "container_db",
  "container_queue",
  "component",
  "component_db",
  "component_queue",
];
// Every diagram's text is this size. src/css/mermaid.css enforces it for
// sizes mermaid hard-codes in its own stylesheets.
const FONT = 11;
const px = (size: number) => `${size}px`;

const c4Styles = Object.fromEntries(
  C4_ELEMENTS.flatMap((el) => [
    [`${el}_bg_color`, N.surfaceAlt],
    [`${el}_border_color`, N.outline],
    [`external_${el}_bg_color`, N.well],
    [`external_${el}_border_color`, N.rule],
    [`${el}FontSize`, FONT],
    [`external_${el}FontSize`, FONT],
  ]),
);

// Render at natural size instead of shrinking wide diagrams (and their text)
// to fit the column; the container scrolls horizontally instead.
const DIAGRAMS = [
  "flowchart",
  "sequence",
  "gantt",
  "journey",
  "timeline",
  "class",
  "state",
  "er",
  "pie",
  "quadrantChart",
  "xyChart",
  "requirement",
  "mindmap",
  "ishikawa",
  "kanban",
  "gitGraph",
  "c4",
  "sankey",
  "block",
  "packet",
  "treeView",
  "architecture",
  "eventmodeling",
  "radar",
  "venn",
  "treemap",
  "wardley-beta",
];
const naturalSize = Object.fromEntries(
  DIAGRAMS.map((d) => [d, { useMaxWidth: false }]),
);

const axis = {
  labelFontSize: FONT,
  titleFontSize: FONT,
  tickWidth: 1,
  axisLineWidth: 1,
};

const DIAGRAM_OPTIONS: Record<string, object> = {
  sequence: {
    actorFontSize: FONT,
    messageFontSize: FONT,
    noteFontSize: FONT,
  },
  journey: {
    taskFontSize: FONT,
    actorColours: SERIES.map((c) => tint(c, 70)),
  },
  timeline: { taskFontSize: FONT },
  // Gantt otherwise sizes itself to the window, not the doc column.
  gantt: { fontSize: FONT, sectionFontSize: FONT, useWidth: 600 },
  er: { fontSize: FONT },
  requirement: { fontSize: FONT },
  quadrantChart: {
    titleFontSize: FONT,
    xAxisLabelFontSize: FONT,
    yAxisLabelFontSize: FONT,
    quadrantLabelFontSize: FONT,
    pointLabelFontSize: FONT,
    pointRadius: 4,
    quadrantExternalBorderStrokeWidth: 1,
  },
  // XY charts always scale to fit, so size them to the doc column instead.
  xyChart: {
    width: 600,
    height: 400,
    titleFontSize: FONT,
    xAxis: axis,
    yAxis: axis,
  },
  "wardley-beta": { axisFontSize: FONT, labelFontSize: FONT },
  architecture: { fontSize: FONT, iconSize: 56 },
  c4: { ...c4Styles, boundaryFontSize: FONT, messageFontSize: FONT },
};

const MERMAID_CONFIG: UserThemeConfig["mermaid"] = {
  // "base" is the only mermaid theme that honours themeVariables.
  theme: { light: "base", dark: "base" },
  options: {
    // For sizes and colours mermaid hard-codes instead of reading from config.
    // Applied while mermaid measures text, so boxes fit labels at any FONT.
    // Wardley maps get no stylesheet at all, so they're fixed in src/css/mermaid.css.
    themeCSS: `
      text, tspan, foreignObject * { font-size: ${px(FONT)} !important; }
      .em-box span { color: ${N.text}; }
      .em-swimlane text { fill: ${N.muted}; }
    `,
    themeVariables: {
      darkMode: true,
      background: N.bg,
      fontFamily: '"Geist Mono", monospace',
      fontSize: px(FONT),

      // Nodes and groups
      primaryColor: N.surface,
      primaryTextColor: N.text,
      primaryBorderColor: N.outline,
      secondaryColor: N.surfaceAlt,
      secondaryTextColor: N.text,
      secondaryBorderColor: N.outline,
      tertiaryColor: N.well,
      tertiaryTextColor: N.text,
      tertiaryBorderColor: N.faint,
      mainBkg: N.surface,
      nodeBorder: N.outline,
      clusterBkg: N.well,
      clusterBorder: N.rule,
      textColor: N.text,
      titleColor: N.text,
      lineColor: N.line,
      arrowheadColor: N.arrow,
      edgeLabelBackground: N.bg,

      noteBkgColor: N.surfaceAlt,
      noteTextColor: N.text,
      noteBorderColor: tint(MOON.gold, 55),

      // Sequence
      actorBkg: N.surface,
      actorBorder: N.outline,
      actorTextColor: N.text,
      actorLineColor: N.rule,
      signalColor: N.line,
      signalTextColor: N.text,
      labelBoxBkgColor: N.surfaceAlt,
      labelBoxBorderColor: N.rule,
      labelTextColor: N.text,
      loopTextColor: N.muted,
      activationBkgColor: N.surfaceAlt,
      activationBorderColor: N.outline,
      sequenceNumberColor: N.bg,

      // State, class, ER
      stateBkg: N.surface,
      // Mermaid otherwise falls back to stateBkg, which makes labels dark.
      stateLabelColor: N.text,
      labelBackgroundColor: N.bg,
      transitionColor: N.line,
      classText: N.text,
      attributeBackgroundColorOdd: N.surface,
      attributeBackgroundColorEven: N.surfaceAlt,
      rowOdd: N.surface,
      rowEven: N.surfaceAlt,

      // Journey
      faceColor: N.surfaceAlt,
      ...indexed("fillType", 8, (i) => tint(at(i), 30)),

      // Gantt
      sectionBkgColor: N.well,
      sectionBkgColor2: N.surface,
      altSectionBkgColor: N.bg,
      gridColor: N.faint,
      taskBkgColor: tint(MOON.iris, 30),
      taskBorderColor: tint(MOON.iris, 60),
      activeTaskBkgColor: tint(MOON.rose, 30),
      activeTaskBorderColor: tint(MOON.rose, 60),
      doneTaskBkgColor: N.surfaceAlt,
      doneTaskBorderColor: N.rule,
      critBkgColor: tint(MOON.love, 30),
      critBorderColor: tint(MOON.love, 60),
      excludeBkgColor: N.well,
      todayLineColor: tint(MOON.rose, 60),
      taskTextColor: N.text,
      taskTextOutsideColor: N.text,
      taskTextLightColor: N.text,
      taskTextDarkColor: N.text,

      // Pie
      ...indexedFrom1("pie", 12, (i) => tint(at(i), 70)),
      pieOpacity: "1",
      pieStrokeColor: N.bg,
      pieStrokeWidth: "1px",
      pieOuterStrokeColor: N.rule,
      pieOuterStrokeWidth: "1px",
      pieTitleTextSize: px(FONT),
      pieTitleTextColor: N.text,
      pieSectionTextSize: px(FONT),
      pieSectionTextColor: N.bg,
      pieLegendTextSize: px(FONT),
      pieLegendTextColor: N.muted,

      // Quadrant
      quadrant1Fill: N.surfaceAlt,
      quadrant2Fill: N.surface,
      quadrant3Fill: N.well,
      quadrant4Fill: N.surface,
      quadrant1TextFill: N.muted,
      quadrant2TextFill: N.muted,
      quadrant3TextFill: N.muted,
      quadrant4TextFill: N.muted,
      quadrantPointFill: MOON.rose,
      quadrantPointTextFill: N.text,
      quadrantXAxisTextFill: N.muted,
      quadrantYAxisTextFill: N.muted,
      quadrantInternalBorderStrokeFill: N.faint,
      quadrantExternalBorderStrokeFill: N.rule,
      quadrantTitleFill: N.text,

      // Requirement
      requirementBackground: N.surface,
      requirementBorderColor: N.outline,
      requirementTextColor: N.text,
      relationColor: N.line,
      relationLabelBackground: N.bg,
      relationLabelColor: N.muted,

      // Git graph
      ...indexed("git", 8, (i) => tint(at(i), 75)),
      ...indexed("gitBranchLabel", 8, () => N.bg),
      commitLabelColor: N.muted,
      commitLabelBackground: N.bg,
      commitLabelFontSize: px(FONT),
      tagLabelFontSize: px(FONT),
      tagLabelColor: N.text,
      tagLabelBackground: N.surfaceAlt,
      tagLabelBorder: N.outline,

      // Mindmap, timeline, kanban, treemap, radar sections
      ...indexed("cScale", 12, (i) => tint(at(i), 30)),
      ...indexed("cScalePeer", 12, (i) => tint(at(i), 45)),
      ...indexed("cScaleInv", 12, (i) => tint(at(i), 80)),
      ...indexed("cScaleLabel", 12, () => N.text),

      // Venn
      ...indexedFrom1("venn", 8, (i) => tint(at(i), 60)),
      vennTitleTextColor: N.text,
      vennSetTextColor: N.muted,

      radar: {
        axisColor: N.rule,
        axisStrokeWidth: 1,
        axisLabelFontSize: FONT,
        curveOpacity: 0.35,
        curveStrokeWidth: 1.5,
        graticuleColor: N.text,
        graticuleOpacity: 0.06,
        graticuleStrokeWidth: 1,
        legendBoxSize: 10,
        legendFontSize: FONT,
      },

      // These three read colours from their own blocks, defaulting to black.
      treeView: {
        labelFontSize: px(FONT),
        labelColor: N.text,
        lineColor: N.line,
      },
      treemap: {
        sectionStrokeColor: N.rule,
        sectionFillColor: N.well,
        leafStrokeColor: N.rule,
        leafFillColor: N.surface,
        labelFontSize: px(FONT),
        valueFontSize: px(FONT),
        titleFontSize: px(FONT),
      },
      packet: {
        byteFontSize: px(FONT),
        startByteColor: N.muted,
        endByteColor: N.muted,
        labelColor: N.text,
        labelFontSize: px(FONT),
        titleColor: N.text,
        titleFontSize: px(FONT),
        blockStrokeColor: N.outline,
        blockFillColor: N.surface,
      },

      xyChart: {
        backgroundColor: N.bg,
        titleColor: N.text,
        dataLabelColor: N.text,
        xAxisTitleColor: N.muted,
        xAxisLabelColor: N.muted,
        xAxisTickColor: N.rule,
        xAxisLineColor: N.rule,
        yAxisTitleColor: N.muted,
        yAxisLabelColor: N.muted,
        yAxisTickColor: N.rule,
        yAxisLineColor: N.rule,
        plotColorPalette: SERIES.map((c) => tint(c, 70)).join(","),
      },

      wardley: {
        backgroundColor: N.bg,
        axisColor: N.line,
        axisTextColor: N.muted,
        gridColor: N.faint,
        componentFill: N.bg,
        componentStroke: N.outline,
        componentLabelColor: N.text,
        linkStroke: N.line,
        evolutionStroke: tint(MOON.rose, 70),
        annotationStroke: N.line,
        annotationTextColor: N.muted,
        annotationFill: N.bg,
      },

      // Architecture
      archEdgeColor: N.line,
      archEdgeArrowColor: N.arrow,
      archEdgeWidth: "1",
      archGroupBorderColor: N.rule,
      archGroupBorderWidth: "1px",

      // Event modeling
      emUiFill: N.surface,
      emUiStroke: N.outline,
      emProcessorFill: tint(MOON.iris, 25),
      emProcessorStroke: tint(MOON.iris, 60),
      emReadModelFill: tint(MOON.foam, 25),
      emReadModelStroke: tint(MOON.foam, 60),
      emCommandFill: tint(MOON.pine, 30),
      emCommandStroke: tint(MOON.pine, 70),
      emEventFill: tint(MOON.gold, 25),
      emEventStroke: tint(MOON.gold, 60),
      emSwimlaneBackgroundOdd: N.well,
      emSwimlaneBackgroundStroke: N.faint,
      emArrowhead: N.arrow,
      emRelationStroke: N.line,
    },

    ...Object.fromEntries(
      DIAGRAMS.map((d) => [d, { ...naturalSize[d], ...DIAGRAM_OPTIONS[d] }]),
    ),
  },
};

export default MERMAID_CONFIG;
