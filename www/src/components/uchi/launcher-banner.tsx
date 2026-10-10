import useBaseUrl from "@docusaurus/useBaseUrl";
import { cn } from "@site/src/lib/utils";

export function LauncherBanner({ className }: { className?: string }) {
  const src = useBaseUrl("images/uchi-topo.webp");

  return (
    <div aria-hidden="true" className={cn("h-24 overflow-hidden", className)}>
      <img src={src} alt="" className="size-full object-cover" />
    </div>
  );
}
