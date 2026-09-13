import FloatingMenu from "@site/src/components/home/floatingmenu";
import CustomTag from "@site/src/components/ui/custom-tag";
import { ArrowLeft } from "lucide-react";

export default function ErrorPageContent() {
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
          src="https://i.pinimg.com/736x/3b/bf/a0/3bbfa04b9df9036a3a2aa8419d962ff6.jpg"
          alt=""
          className="mt-4 size-40 rounded-md object-cover shadow-md"
        />
      </section>
      <div className="relative z-20">
        <FloatingMenu />
      </div>
    </main>
  );
}
