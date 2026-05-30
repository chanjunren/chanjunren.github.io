import { useState } from "react";
import { ModelResult } from "@site/src/types/mvm";
import {
  MOCK_MODELS,
  MOCK_PROMPT,
  MOCK_RESULTS,
  MOCK_RESULTS_ERROR,
  MOCK_RESULTS_STREAMING,
} from "./mock-data";

export type MockScene = "done" | "streaming" | "error";

export const SCENES: { key: MockScene; label: string }[] = [
  { key: "done", label: "Completed" },
  { key: "streaming", label: "Streaming" },
  { key: "error", label: "With Error" },
];

const SCENE_DATA: Record<MockScene, Record<string, ModelResult>> = {
  done: MOCK_RESULTS,
  streaming: MOCK_RESULTS_STREAMING,
  error: MOCK_RESULTS_ERROR,
};

export default function useMvm() {
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

  return {
    scene,
    setScene,
    prompt,
    setPrompt,
    selectedModels,
    toggleModel,
    connected,
    loading,
    results,
    models: MOCK_MODELS,
  };
}
