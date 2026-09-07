import CustomTag from "@site/src/components/ui/custom-tag";

export function UshiFallback() {
  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <CustomTag color="rose" className="text-lg! font-semibold">
          うち
        </CustomTag>
        <p className="m-0 text-sm leading-relaxed text-muted-foreground">
          Ushi is a private workspace for local tools and personal projects
        </p>
      </div>
    </main>
  );
}
