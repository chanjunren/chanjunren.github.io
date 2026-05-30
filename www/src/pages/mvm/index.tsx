import {HamburgerMenuIcon} from "@radix-ui/react-icons";
import {Button} from "@site/src/components/ui/button";
import CustomTag from "@site/src/components/ui/custom-tag";
import Page from "@site/src/components/ui/page";
import {Sheet, SheetContent, SheetTitle, SheetTrigger,} from "@site/src/components/ui/sheet";
import MvmSidebar from "@site/src/components/mvm/mvm-sidebar";
import PromptForm from "@site/src/components/mvm/prompt-form";
import ResultsGrid from "@site/src/components/mvm/results-grid";
import useMvm from "@site/src/components/mvm/use-mvm";
import {FC} from "react";

const MvmPage: FC = () => {
  const mvm = useMvm();

  const sidebarProps = {
    connected: mvm.connected,
    models: mvm.models,
    selectedModels: mvm.selectedModels,
    onToggleModel: mvm.toggleModel,
    scene: mvm.scene,
    onSceneChange: mvm.setScene,
  };

  return (
    <Page
      title="MVM"
      description="Compare Claude model outputs side-by-side"
      className="pt-7 !max-w-full"
    >
      {/* Mobile sheet trigger */}
      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit">
              <HamburgerMenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">MVM Controls</SheetTitle>
            <MvmSidebar {...sidebarProps} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: single row — left content grows, right sidebar at top */}
      <div className="flex gap-16 items-start">
        {/* Left: header + main content */}
        <div className="flex flex-col gap-6 flex-grow min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <CustomTag color="rose" className="text-lg tracking-tighter! w-fit">
              MVM
            </CustomTag>
            <span className="text-sm">
              A utility for comparing Claude model outputs
            </span>
          </div>


            <span className="text-sm text-(--reduced-emphasis-color)">
              This tool requires a custom server, please reach out if you are interested :D
            </span>

          {/* Main content */}
          <PromptForm
            prompt={mvm.prompt}
            onPromptChange={mvm.setPrompt}
            onSubmit={() => {}}
            loading={mvm.loading}
            disabled={!mvm.connected}
          />
          <ResultsGrid models={mvm.models} results={mvm.results} />
        </div>

        {/* Right: sidebar panels */}
        <div className="hidden md:flex flex-shrink-0">
          <MvmSidebar {...sidebarProps} />
        </div>
      </div>
    </Page>
  );
};

export default MvmPage;
