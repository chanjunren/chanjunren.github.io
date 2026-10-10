import { useHistory, useLocation } from "@docusaurus/router";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@site/src/components/ui/command";
import CustomTag from "@site/src/components/ui/custom-tag";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@site/src/components/ui/dialog";
import { Kbd, KbdGroup } from "@site/src/components/ui/kbd";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { SplitFlap } from "@site/src/components/ui/split-flap";
import { cn } from "@site/src/lib/utils";
import { useEffect, useState } from "react";
import { useFlipLabel } from "./hooks";
import { LauncherBanner } from "./launcher-banner";

export const applications = [
  { label: "Kakeibo", href: "/uchi/kakeibo" },
  { label: "MVM", href: "/uchi/mvm" },
];

// The dialog portals to <body>, outside UchiLayout's variable scope.
const menuTheme = [
  "[--background:var(--menu-background)]",
  "[--popover:var(--menu-background)]",
  "[--popover-foreground:var(--menu-foreground)]",
  "[--foreground:var(--menu-foreground)]",
  "[--muted-foreground:var(--menu-subtle)]",
  "[--accent:var(--menu-muted-background)]",
  "[--accent-foreground:var(--menu-foreground)]",
];

export function LauncherMenu({
  currentHref,
  onNavigate,
  onSignOut,
}: {
  currentHref?: string;
  onNavigate: (href: string) => void;
  onSignOut?: () => void;
}) {
  return (
    <div className={cn("flex flex-col", menuTheme)}>
      <LauncherBanner />
      {/* No search input, so the root takes focus for arrow-key navigation. */}
      <Command tabIndex={0} className="bg-transparent outline-none">
        {/* Without an input, cmdk moves focus to the list on arrow keys. */}
        <CommandList className="max-h-none p-1 outline-none">
          <CommandGroup>
            {applications.map((application) => (
              <CommandItem
                key={application.href}
                value={application.label}
                onSelect={() => onNavigate(application.href)}
              >
                <MonoLabel className="text-sm">{application.label}</MonoLabel>
                {application.href === currentHref && (
                  <CustomTag color="rose" className="ml-auto text-xs!">
                    CURRENT
                  </CustomTag>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          {onSignOut && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem value="sign out" onSelect={onSignOut}>
                  <MonoLabel className="text-sm">sign out</MonoLabel>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export function UchiLauncher({
  onSignOut,
  className,
}: {
  onSignOut?: () => Promise<void>;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const current = applications.find((application) =>
    pathname.startsWith(application.href),
  );
  const label = useFlipLabel(current?.label ?? "uchi");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className={cn("flex items-center gap-3", className)}>
        <SplitFlap value={label} className="text-xl" />
        <button
          type="button"
          aria-label="Open launcher"
          title="Open launcher"
          onClick={() => setOpen(true)}
          className="cursor-pointer border-0 bg-transparent p-0"
        >
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>J</Kbd>
          </KbdGroup>
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn("overflow-hidden p-0 sm:max-w-lg", menuTheme)}
        >
          <DialogTitle className="sr-only">Launcher</DialogTitle>
          <DialogDescription className="sr-only">
            Jump to an Uchi app
          </DialogDescription>
          <LauncherMenu
            currentHref={current?.href}
            onNavigate={(href) => {
              setOpen(false);
              history.push(href);
            }}
            onSignOut={
              onSignOut &&
              (() => {
                setOpen(false);
                void onSignOut();
              })
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
