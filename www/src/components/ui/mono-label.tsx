import * as React from "react";

import { cn } from "@site/src/lib/utils";

function MonoLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mono-label"
      className={cn(
        "font-mono text-base font-normal uppercase tracking-tighter text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { MonoLabel };
