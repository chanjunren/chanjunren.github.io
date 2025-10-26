import Heading from "@theme/Heading";
import type { Props } from "@theme/MDXComponents/Heading";
import { type ReactNode } from "react";

export default function MDXHeading(props: Props): ReactNode {
  // Customize H1 titles
  if (props.as === "h1" && typeof props.children === "string") {
    // Transform snake_case to Title Case
    const formattedTitle = props.children
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return <h1 {...props}>🪴 {formattedTitle}</h1>;
  }

  return <Heading {...props} />;
}
