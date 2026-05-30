import { FC } from "react";
import PromptForm from "./prompt-form";
import ResultsGrid from "./results-grid";
import useMvm from "./use-mvm";

const MvmView: FC = () => {
  const mvm = useMvm();

  return (
    <div className="flex flex-col gap-6">
      <PromptForm
        prompt={mvm.prompt}
        onPromptChange={mvm.setPrompt}
        onSubmit={() => {}}
        loading={mvm.loading}
        disabled={!mvm.connected}
      />
      <ResultsGrid models={mvm.models} results={mvm.results} />
    </div>
  );
};

export default MvmView;
