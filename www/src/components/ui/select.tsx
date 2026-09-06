import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@site/src/lib/utils";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) { return <SelectPrimitive.Root data-slot="select" {...props} />; }
function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger data-slot="select-trigger" className={cn("flex h-9 w-fit cursor-pointer items-center justify-between gap-2 rounded-md border bg-background px-3 text-base shadow-xs outline-none hover:bg-(--menu-accent) hover:text-(--menu-foreground) focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", className)} {...props}>{children}<SelectPrimitive.Icon><ChevronDown className="size-4 opacity-60" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>;
}
function SelectContent({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content data-slot="select-content" position="popper" className={cn("z-50 min-w-32 overflow-hidden rounded-md border bg-(--menu-background) p-1 text-(--menu-foreground) shadow-md", className)} {...props} /></SelectPrimitive.Portal>;
}
function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return <SelectPrimitive.Item data-slot="select-item" className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-base outline-none hover:bg-(--menu-accent) hover:text-(--menu-foreground) focus:bg-(--menu-accent) focus:text-(--menu-foreground) data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator className="absolute right-2" /></SelectPrimitive.Item>;
}

export { Select, SelectContent, SelectItem, SelectTrigger };
