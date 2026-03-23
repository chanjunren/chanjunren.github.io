import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@site/src/components/ui/dialog";
import CustomTag from "@site/src/components/ui/custom-tag";
import AnimatedBarChartIcon from "@site/src/components/ui/icons/bar-chart-icon";
import { FC } from "react";

const GRAFANA_DASHBOARD_URL =
  "https://chanjunren.grafana.net/public-dashboards/2ec42142e19e4a6d80e91cdce2ce059b";

const QuoteStatistics: FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AnimatedBarChartIcon className="border-b hover:border-b-foreground transition-all" />
      </DialogTrigger>
      <DialogContent className="flex flex-col min-h-5/6 min-w-5/6">
        <DialogHeader>
          <CustomTag color="rose">STATISTICS</CustomTag>
        </DialogHeader>
        <iframe
          src={`${GRAFANA_DASHBOARD_URL}?theme=light`}
          className="w-full flex-1 border-0 rounded"
          // onLoad={() => setLoaded(true)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteStatistics;
