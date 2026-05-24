import { ModelInfo, ModelResult } from "@site/src/types/mvm";
import { FC } from "react";
import ResultCard from "./result-card";

type Props = {
  models: ModelInfo[];
  results: Record<string, ModelResult>;
};

const ResultsGrid: FC<Props> = ({ models, results }) => {
  const activeModels = models.filter((m) => results[m.alias]);

  if (activeModels.length === 0) return null;

  const cols =
    activeModels.length === 1
      ? "grid-cols-1"
      : activeModels.length === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-3";

  return (
    <div className={`grid ${cols} gap-5 items-start`}>
      {activeModels.map((model) => (
        <ResultCard
          key={model.alias}
          modelName={model.name}
          result={results[model.alias]}
        />
      ))}
    </div>
  );
};

export default ResultsGrid;
