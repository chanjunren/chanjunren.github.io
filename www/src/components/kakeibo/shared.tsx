import { type ReactNode } from "react";
import CustomTag from "@site/src/components/ui/custom-tag";
import { Button } from "@site/src/components/ui/button";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@site/src/components/ui/tooltip";

export function CategoryTag({
  children,
  markerColor,
}: {
  children: ReactNode;
  markerColor?: string;
}) {
  return (
    <CustomTag
      color="neutral"
      className="inline-flex! items-center gap-1.5 text-sm! font-normal"
    >
      {markerColor && (
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: markerColor }}
        />
      )}
      {children}
    </CustomTag>
  );
}

export function Wordmark() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="w-fit border-0 bg-transparent p-0">
          <CustomTag color="rose" className="text-base! font-semibold">
            うち
          </CustomTag>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="max-w-64 leading-relaxed"
      >
        うち (uchi)
        <br />
        meaning home, inside, or one&apos;s inner circle
        <br />
        <br />
        my secret projects
      </TooltipContent>
    </Tooltip>
  );
}

export function KakeiboSidebar({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <aside className="relative hidden w-72 shrink-0 bg-background lg:flex lg:flex-col">
      <div className="absolute bottom-8 right-0 top-8 w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)]" />
      <div className="px-6 pt-8">
        <Wordmark />
      </div>
      <div className="mt-10 flex min-h-0 flex-1 flex-col gap-8 overflow-auto px-6 pb-8">
        <nav
          className="flex flex-col items-start gap-1"
          aria-label="Applications"
        >
          <span className="flex h-9 w-fit items-center rounded-md border border-border bg-(--menu-muted-background) px-2 text-left text-base font-medium tracking-tight text-(--menu-foreground)">
            Kakeibo
          </span>
        </nav>
      </div>
      <div className="px-6 pb-8">
        <SignOutButton onSignOut={onSignOut} />
      </div>
    </aside>
  );
}

export function SignOutButton({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="px-2 text-muted-foreground hover:text-foreground"
      onClick={() => void onSignOut()}
    >
      <MonoLabel className="text-inherit">Sign out</MonoLabel>
    </Button>
  );
}
