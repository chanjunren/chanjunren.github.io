import {Button} from "@site/src/components/ui/button";
import CustomTag from "@site/src/components/ui/custom-tag";
import Page from "@site/src/components/ui/page";
import {Sheet, SheetContent, SheetTitle, SheetTrigger,} from "@site/src/components/ui/sheet";
import MvmSidebar from "@site/src/components/mvm/mvm-sidebar";
import PromptForm from "@site/src/components/mvm/prompt-form";
import ResultsGrid from "@site/src/components/mvm/results-grid";
import useMvm from "@site/src/components/mvm/use-mvm";
import {IconGear} from "nucleo-isometric";
import {FC} from "react";

const MvmPage: FC = () => {
    const mvm = useMvm();

    const sidebarProps = {
        connected: mvm.connected,
        health: mvm.health,
        models: mvm.models,
        selectedModels: mvm.selectedModels,
        onToggleModel: mvm.toggleModel,
    };

    return (
        <Page
            title="MVM"
            description="Compare Claude model outputs side-by-side"
            className="pt-7 max-w-full!"
        >
            <div className="flex gap-16 items-start">
                <div className="flex flex-col gap-6 grow min-w-0">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <CustomTag color="rose" className="text-lg tracking-tighter! w-fit">
                            MVM
                        </CustomTag>
                        <span>
              A utility for comparing Claude model outputs
              <br/>
              <span className="text-(--reduced-emphasis-color) mt-5">
                This tool requires a custom server, please reach out if you are interested :D
              </span>
            </span>
                    </div>

                    {/* Mobile settings button + sheet */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                    <IconGear size="16px"/>
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
                    <ResultsGrid models={mvm.models} selectedModels={mvm.selectedModels} results={mvm.results}/>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:flex shrink-0">
                    <MvmSidebar {...sidebarProps} />
                </div>
            </div>
        </Page>
    );
};

export default MvmPage;
