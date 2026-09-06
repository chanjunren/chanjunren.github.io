import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@site/src/components/ui/button";
import { Calendar, type MonthRange } from "@site/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@site/src/components/ui/popover";
import { type MonthRange as ApiMonthRange } from "../api";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  year: "numeric",
});

function formatRange(range: MonthRange) {
  if (!range.from) return "Select months";
  const from = monthFormatter.format(range.from);
  return range.to && from !== monthFormatter.format(range.to)
    ? `${from} – ${monthFormatter.format(range.to)}`
    : from;
}

function monthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function toApiMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function DateRangePicker({
  value,
  onChange,
}: {
  value: ApiMonthRange;
  onChange: (range: ApiMonthRange) => void;
}) {
  const [range, setRange] = useState<MonthRange>({
    from: new Date(`${value.from}-01T00:00:00`),
    to: new Date(`${value.to}-01T00:00:00`),
  });
  const [month, setMonth] = useState(new Date(`${value.to}-01T00:00:00`));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nextRange = {
      from: new Date(`${value.from}-01T00:00:00`),
      to: new Date(`${value.to}-01T00:00:00`),
    };
    setRange(nextRange);
    setMonth(nextRange.to);
  }, [value.from, value.to]);

  function selectMonth(selectedMonth: Date) {
    if (
      !range.from ||
      range.to ||
      monthKey(selectedMonth) < monthKey(range.from)
    ) {
      setRange({ from: selectedMonth });
      return;
    }

    const nextRange = { from: range.from, to: selectedMonth };
    setRange(nextRange);
    onChange({
      from: toApiMonth(nextRange.from),
      to: toApiMonth(nextRange.to),
    });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="font-mono text-sm">
          <CalendarDays aria-hidden="true" />
          {formatRange(range)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <Calendar
          month={month}
          selected={range}
          onSelect={selectMonth}
          onMonthChange={setMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
