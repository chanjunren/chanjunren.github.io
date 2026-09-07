import Page from "@site/src/components/ui/page";
import {
  UshiMobileNav,
  UshiSidebar,
  Wordmark,
} from "@site/src/components/ushi/sidebar";
import { type CSSProperties, type ReactNode } from "react";

export function UshiLayout({
  title,
  description,
  onSignOut,
  showSidebar = true,
  children,
}: {
  title: string;
  description: string;
  onSignOut?: () => Promise<void>;
  showSidebar?: boolean;
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
        {showSidebar && <UshiSidebar onSignOut={onSignOut} />}
        <section className="min-w-0 flex-1">
          {showSidebar && (
            <div className="flex items-center justify-between px-5 pt-5 lg:hidden">
              <Wordmark />
              <UshiMobileNav onSignOut={onSignOut} />
            </div>
          )}
          {children}
        </section>
      </main>
    </Page>
  );
}
