import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export function ErrorPage({
  title = "Something went wrong",
  description = "We couldn’t load this section. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center text-card-foreground">
      <div className="flex max-w-md flex-col items-center gap-3">
        <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
        <h2 className="m-0 text-lg font-medium">{title}</h2>
        <p className="m-0 text-sm text-muted-foreground">{description}</p>
        {onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </main>
  );
}
