import { SplitFlap } from "@site/src/components/ui/split-flap";

export function UchiFallback() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background px-6">
      <SplitFlap flipIn value="LOCKED" className="text-2xl" />
    </main>
  );
}
