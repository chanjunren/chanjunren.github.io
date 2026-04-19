import DailyBarChart from "@site/src/components/home/quote/charts/daily-bar-chart";
import ModelDonutChart from "@site/src/components/home/quote/charts/model-donut-chart";
import SummaryKpis from "@site/src/components/home/quote/charts/summary-kpis";
import TokenAreaChart from "@site/src/components/home/quote/charts/token-area-chart";
import CustomTag from "@site/src/components/ui/custom-tag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@site/src/components/ui/dialog";
import AnimatedBarChartIcon from "@site/src/components/ui/icons/bar-chart-icon";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { useMateriaSummary } from "@site/src/hooks/useMateriaSummary";
import { FC } from "react";

const QuoteStatistics: FC = () => {
  const { summary, message } = useMateriaSummary();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AnimatedBarChartIcon className="border-b hover:border-b-foreground transition-all" />
      </DialogTrigger>
      <DialogContent className="flex flex-col min-h-5/6 min-w-5/6 gap-6 overflow-auto">
        <DialogHeader>
          <CustomTag color="rose">STATISTICS</CustomTag>
        </DialogHeader>
        {summary ? (
          <div className="flex flex-col gap-6">
            <SummaryKpis summary={summary} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-72">
                <DailyBarChart data={summary.byDate} />
              </div>
              <div className="h-72">
                <ModelDonutChart data={summary.byModel} />
              </div>
            </div>
            <div className="h-72">
              <TokenAreaChart data={summary.byDate} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <TypewriterText active text={message ?? "等等。。。"} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteStatistics;
