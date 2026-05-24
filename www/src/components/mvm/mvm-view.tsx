import { EyeOpenIcon } from "@radix-ui/react-icons";
import CustomTag from "@site/src/components/ui/custom-tag";
import SecondaryHeader from "@site/src/components/ui/secondary-header";
import { Toggle } from "@site/src/components/ui/toggle";
import { ModelResult } from "@site/src/types/mvm";
import { FC, useState } from "react";
import ConnectionBanner from "./connection-banner";
import {
  MOCK_MODELS,
  MOCK_PROMPT,
  MOCK_RESULTS,
  MOCK_RESULTS_ERROR,
  MOCK_RESULTS_STREAMING,
} from "./mock-data";
import PromptForm from "./prompt-form";
import ResultsGrid from "./results-grid";

type MockScene = "done" | "streaming" | "error";

const SCENES: { key: MockScene; label: string }[] = [
  { key: "done", label: "Completed" },
  { key: "streaming", label: "Streaming" },
  { key: "error", label: "With Error" },
];

const SCENE_DATA: Record<MockScene, Record<string, ModelResult>> = {
  done: MOCK_RESULTS,
  streaming: MOCK_RESULTS_STREAMING,
  error: MOCK_RESULTS_ERROR,
};

const MvmView: FC = () => {
  const [scene, setScene] = useState<MockScene>("done");
  const [prompt, setPrompt] = useState(MOCK_PROMPT);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "haiku",
    "sonnet",
    "opus",
  ]);

  const connected = true;
  const loading = scene === "streaming";
  const results = SCENE_DATA[scene];

  const toggleModel = (alias: string) => {
    setSelectedModels((prev) =>
      prev.includes(alias) ? prev.filter((m) => m !== alias) : [...prev, alias]
    );
  };

  return (
    <div className="flex flex-col gap-10 pt-7">
      <div className="flex flex-col gap-2">
        <CustomTag
          color="rose"
          className="text-lg tracking-tighter! w-fit"
        >
          MODEL VS MODEL
        </CustomTag>
        <span className="text-(--reduced-emphasis-color)">
          Compare Claude model outputs side-by-side
        </span>
      </div>

      <div className="flex items-center gap-3">
        <SecondaryHeader className="flex items-center gap-1.5 ">
          <EyeOpenIcon className="size-3" />
          Preview
        </SecondaryHeader>
        <div className="flex gap-1">
          {SCENES.map((s) => (
            <Toggle
              key={s.key}
              size="sm"
              pressed={scene === s.key}
              onPressedChange={() => setScene(s.key)}
            >
              {s.label}
            </Toggle>
          ))}
        </div>
      </div>

      <ConnectionBanner connected={connected} />

      <PromptForm
        models={MOCK_MODELS}
        selectedModels={selectedModels}
        onToggleModel={toggleModel}
        prompt={prompt}
        onPromptChange={setPrompt}
        onSubmit={() => {}}
        loading={loading}
        disabled={!connected}
      />

      <ResultsGrid models={MOCK_MODELS} results={results} />
    </div>
  );
};

export default MvmView;
