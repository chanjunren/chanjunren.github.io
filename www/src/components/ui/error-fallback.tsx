import { ArrowLeft } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "./button";
import CustomTag from "./custom-tag";

const errorImage =
  "https://i.pinimg.com/736x/3b/bf/a0/3bbfa04b9df9036a3a2aa8419d962ff6.jpg";

export function ErrorFallback({
  onRetry,
  fullPage = false,
}: {
  onRetry?: () => void;
  fullPage?: boolean;
}) {
  if (!fullPage) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <CustomTag color="locked">报错了</CustomTag>
            {onRetry && (
              <Button
                type="button"
                variant="menu"
                size="icon-sm"
                aria-label="Retry"
                title="Retry"
                onClick={onRetry}
              >
                <ReloadIcon aria-hidden="true" />
              </Button>
            )}
          </div>
          <img
            src={errorImage}
            alt=""
            className="size-40 rounded-md object-cover shadow-md"
          />
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-(--menu-background) px-6 pb-28 text-center text-(--menu-foreground)">
      <section className="relative z-10 flex max-w-sm flex-col items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go back"
            title="Go back"
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else window.location.assign("/");
            }}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-(--menu-foreground) hover:bg-(--menu-accent)"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <CustomTag color="locked" className="text-sm! font-semibold">
            PAGE EXCEPTION
          </CustomTag>
        </div>
        <img
          src={errorImage}
          alt=""
          className="mt-4 size-40 rounded-md object-cover shadow-md"
        />
      </section>
    </main>
  );
}
