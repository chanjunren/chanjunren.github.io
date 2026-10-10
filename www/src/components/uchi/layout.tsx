import Page from "@site/src/components/ui/page";
import { UchiLauncher } from "@site/src/components/uchi/launcher";
import { cn } from "@site/src/lib/utils";
import { type CSSProperties, type ReactNode } from "react";

export function UchiFocusedPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full p-5 lg:p-10", className)}>{children}</div>;
}

export function UchiLayout({
  title,
  description,
  onSignOut,
  showLauncher = true,
  children,
}: {
  title: string;
  description: string;
  onSignOut?: () => Promise<void>;
  showLauncher?: boolean;
  children: ReactNode;
}) {
  return (
    <Page
      title={title}
      description={description}
      className="max-w-full! p-0!"
      footer={null}
      wrapperClassName="items-stretch! gap-0! p-0!"
    >
      <main
        className="flex min-h-[calc(100vh-57px)] bg-(--menu-background) text-base text-(--menu-foreground)"
        style={
          {
            "--background": "var(--menu-background)",
            "--foreground": "var(--menu-foreground)",
            "--card": "var(--menu-background)",
            "--card-foreground": "var(--menu-foreground)",
            "--muted": "var(--menu-muted-background)",
            "--muted-foreground": "var(--menu-subtle)",
            "--accent": "var(--menu-accent)",
            "--accent-foreground": "var(--menu-accent-foreground)",
            "--chart-1": "#b4637a",
            "--chart-2": "#286983",
            "--chart-3": "#56949f",
            "--chart-4": "#907aa9",
          } as CSSProperties
        }
      >
        <section className="min-w-0 flex-1">
          {showLauncher && (
            <UchiLauncher onSignOut={onSignOut} className="px-5 pt-5 lg:px-10 lg:pt-10" />
          )}
          {children}
        </section>
      </main>
    </Page>
  );
}
