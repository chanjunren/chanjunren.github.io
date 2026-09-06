import { CalendarDays } from "lucide-react";

import { Button } from "@site/src/components/ui/button";
import { Calendar, type MonthRange } from "@site/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@site/src/components/ui/popover";
import { useState } from "react";

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

export function DateRangePicker() {
  const [range, setRange] = useState<MonthRange>({
    from: new Date(2026, 4, 1),
    to: new Date(2026, 7, 1),
  });
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [open, setOpen] = useState(false);
  function selectMonth(value: Date) {
    if (!range.from || range.to || monthKey(value) < monthKey(range.from))
      setRange({ from: value });
    else {
      setRange({ from: range.from, to: value });
      setOpen(false);
    }
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
