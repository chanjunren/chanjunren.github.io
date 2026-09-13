import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MvmSidebar from "@site/src/components/mvm/mvm-sidebar";
import PromptForm from "@site/src/components/mvm/prompt-form";
import ResultsGrid from "@site/src/components/mvm/results-grid";
import useMvm from "@site/src/components/mvm/use-mvm";
import { Button } from "@site/src/components/ui/button";
import CustomTag from "@site/src/components/ui/custom-tag";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@site/src/components/ui/sheet";
import { type UchiConfig } from "@site/src/components/uchi/api";
import { useAuth } from "@site/src/components/uchi/hooks";
import { UchiLayout } from "@site/src/components/uchi/layout";
import { IconGear } from "nucleo-isometric";
import { type FC } from "react";

const MvmPage: FC = () => {
  const { search } = useLocation();

  if (new URLSearchParams(search).has("forceError")) {
    throw new Error("Temporary preview error: the MVM page failed to render.");
  }

  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields as {
    uchi: UchiConfig;
  };

  return <MvmApp apiBase={customFields.uchi.apiBase} />;
};

function MvmApp({ apiBase }: { apiBase: string }) {
  const mvm = useMvm(apiBase);
  const { signOut } = useAuth();
  const sidebarProps = {
    connected: mvm.connected,
    health: mvm.health,
    models: mvm.models,
    selectedModels: mvm.selectedModels,
    onToggleModel: mvm.toggleModel,
  };

  return (
    <>
      <UchiLayout
        title="MVM"
        description="Compare Claude model outputs side-by-side"
        onSignOut={signOut}
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 p-5 lg:p-10">
          <div className="flex items-start gap-16">
            <div className="flex min-w-0 grow flex-col gap-6">
              <div className="flex flex-col gap-2">
                <CustomTag
                  color="rose"
                  className="w-fit text-lg! tracking-tighter"
                >
                  MVM
                </CustomTag>
                <span>
                  A utility for comparing Claude model outputs
                  <br />
                  <span className="mt-5 text-(--reduced-emphasis-color)">
                    This tool runs against your local Uchi server.
                  </span>
                </span>
              </div>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <IconGear size="16px" />
                      Settings
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="p-6">
                    <SheetTitle className="sr-only">MVM Controls</SheetTitle>
                    <MvmSidebar {...sidebarProps} />
                  </SheetContent>
                </Sheet>
              </div>
              <PromptForm
                prompt={mvm.prompt}
                onPromptChange={mvm.setPrompt}
                onSubmit={mvm.submit}
                loading={mvm.loading}
                disabled={!mvm.connected || mvm.health?.status === "degraded"}
              />
              {mvm.submitError && (
                <span className="text-sm text-(--ifm-color-primary)">
                  {mvm.submitError}
                </span>
              )}
              <ResultsGrid
                models={mvm.models}
                selectedModels={mvm.selectedModels}
                results={mvm.results}
              />
            </div>
            <div className="hidden shrink-0 md:flex">
              <MvmSidebar {...sidebarProps} />
            </div>
          </div>
        </div>
      </UchiLayout>
    </>
  );
}

export default MvmPage;
