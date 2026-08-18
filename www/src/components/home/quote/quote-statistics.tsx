import ModelDonutChart from "@site/src/components/home/quote/charts/model-donut-chart";
import TokenAreaChart from "@site/src/components/home/quote/charts/token-area-chart";
import TotalQuotes from "@site/src/components/home/quote/charts/total-quotes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
        <AnimatedBarChartIcon />
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto border-0 bg-background p-5 shadow-xl sm:max-w-4xl sm:p-8">
        <DialogTitle className="sr-only">Quote statistics</DialogTitle>
        <DialogDescription className="sr-only">
          Quote totals, token activity over the last 30 days, and usage by
          model.
        </DialogDescription>
        {summary ? (
          <div className="flex flex-col gap-8">
            <TotalQuotes summary={summary} />
            <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
              <section className="h-72 min-w-0">
                <TokenAreaChart data={summary.byDate} />
              </section>
              <section className="h-72 min-w-0">
                <ModelDonutChart data={summary.byModel} />
              </section>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex min-h-72 items-center justify-center p-8 text-sm">
            <TypewriterText active text={message ?? "等等。。。"} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuoteStatistics;
