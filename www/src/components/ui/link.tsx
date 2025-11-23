import DocusaurusLink from "@docusaurus/Link";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@site/src/lib/utils";

const linkVariants = cva("no-underline!", {
  variants: {
    variant: {
      default: "transition-all",
      menu: "text-(--menu-foreground)! hover:no-underline!  hover:bg-(--menu-accent)!",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface LinkProps
  extends React.ComponentProps<typeof DocusaurusLink>,
    VariantProps<typeof linkVariants> {}

function Link({ className, variant = "default", ...props }: LinkProps) {
  return (
    <DocusaurusLink
      className={cn(linkVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Link, linkVariants };
