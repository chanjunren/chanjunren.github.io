import { SplitFlap } from "@site/src/components/ui/split-flap";
import Heading from "@theme-original/Heading";
import type { Props } from "@theme/Heading";
import type { ReactNode } from "react";

export default function HeadingWrapper(props: Props): ReactNode {
  if (props.as !== "h1" || typeof props.children !== "string") {
    return <Heading {...props} />;
  }

  const title = props.children.replaceAll("_", " ").toUpperCase();

  return (
    <Heading {...props}>
      <SplitFlap
        key={title}
        flipIn
        value={title}
        className="max-w-full flex-wrap gap-y-1 text-xl"
      />
    </Heading>
  );
}
