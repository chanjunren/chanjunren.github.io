import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";
import { Button } from "@site/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@site/src/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Wordmark } from "./shared";

export { Wordmark } from "./shared";

const applications = [
  { label: "Kakeibo", href: "/ushi/kakeibo" },
  { label: "MVM", href: "/ushi/mvm" },
];

function ApplicationLinks({ onSelect }: { onSelect?: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col items-start gap-1" aria-label="Applications">
      {applications.map((application) => {
        const active = pathname.startsWith(application.href);
        return (
          <Link
            key={application.href}
            to={application.href}
            onClick={onSelect}
            className={[
              "flex h-9 w-fit items-center rounded-md border px-2 text-left text-base font-medium tracking-tight no-underline transition-colors hover:no-underline",
              active
                ? "border-border bg-(--menu-muted-background) text-(--menu-foreground)!"
                : "border-transparent text-(--menu-foreground)! hover:bg-(--menu-muted-background) hover:text-(--menu-foreground)!",
            ].join(" ")}
            style={{ textDecoration: "none" }}
          >
            {application.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function UshiSidebar({
  onSignOut,
}: {
  onSignOut?: () => Promise<void>;
}) {
  return (
    <aside className="relative sticky top-0 hidden h-[calc(100vh-57px)] w-60 shrink-0 self-start bg-(--menu-background) lg:flex lg:flex-col">
      <div className="absolute bottom-8 right-0 top-8 w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)]" />
      <div className="flex items-center gap-2 px-6 pt-8">
        {onSignOut && <SignOutButton onSignOut={onSignOut} />}
        <Wordmark />
      </div>
      <div className="mt-10 flex min-h-0 flex-1 flex-col gap-8 overflow-auto px-6 pb-8">
        <ApplicationLinks />
      </div>
    </aside>
  );
}

export function UshiMobileNav({
  onSignOut,
}: {
  onSignOut?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="menu"
          size="icon"
          aria-label="Open Ushi menu"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-(--menu-background)! p-6 text-(--menu-foreground)!"
      >
        <SheetTitle className="mb-8 flex items-center gap-2 text-(--menu-foreground)!">
          {onSignOut && <SignOutButton onSignOut={onSignOut} />}
          <Wordmark />
        </SheetTitle>
        <div className="flex h-full flex-col">
          <ApplicationLinks onSelect={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SignOutButton({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label="Sign out"
      title="Sign out"
      variant="menu"
      onClick={() => void onSignOut()}
    >
      <LogOut aria-hidden="true" />
    </Button>
  );
}
