import HeaderTag from "@site/src/components/common/HeaderTag";
import Heading from "@theme/Heading";
import type { Props } from "@theme/MDXComponents/Heading";
import { type ReactNode } from "react";

export default function MDXHeading(props: Props): ReactNode {
  // Customize H1 titles
  if (props.as === "h1" && typeof props.children === "string") {
    // Transform snake_case to Title Case
    const formattedTitle = props.children
      .split("_")
      .map((word) => word.toUpperCase())
      .join(" ");

    return (
      <HeaderTag className="mb-5 text-lg" color="rose" label={formattedTitle} />
    );
  }

  return <Heading {...props} />;
}
