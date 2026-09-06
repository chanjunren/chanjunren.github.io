import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@site/src/components/ui/button";
import { cn } from "@site/src/lib/utils";

export type MonthRange = { from?: Date; to?: Date };
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yearFormatter = new Intl.DateTimeFormat("en", { year: "numeric" });

function monthKey(date?: Date) { return date ? date.getFullYear() * 12 + date.getMonth() : undefined; }
function sameMonth(left?: Date, right?: Date) { return monthKey(left) === monthKey(right); }
function isBetween(date: Date, range: MonthRange) { const key = monthKey(date); const from = monthKey(range.from); const to = monthKey(range.to); return key !== undefined && from !== undefined && to !== undefined && key > from && key < to; }

export function Calendar({ month, selected, onSelect, onMonthChange }: { month: Date; selected?: MonthRange; onSelect: (month: Date) => void; onMonthChange: (month: Date) => void }) {
  return <div className="w-72 select-none text-(--menu-foreground)"><div className="mb-3 flex items-center justify-between"><Button type="button" variant="ghost" size="icon-sm" aria-label="Previous year" className="cursor-pointer text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)" onClick={() => onMonthChange(new Date(month.getFullYear() - 1, month.getMonth(), 1))}><ChevronLeft /></Button><span className="font-mono text-sm font-medium">{yearFormatter.format(month)}</span><Button type="button" variant="ghost" size="icon-sm" aria-label="Next year" className="cursor-pointer text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)" onClick={() => onMonthChange(new Date(month.getFullYear() + 1, month.getMonth(), 1))}><ChevronRight /></Button></div><div className="grid grid-cols-3 gap-2">{months.map((label, index) => { const value = new Date(month.getFullYear(), index, 1); const start = sameMonth(value, selected?.from); const end = sameMonth(value, selected?.to); return <button key={label} type="button" onClick={() => onSelect(value)} className={cn("h-10 cursor-pointer rounded-md text-sm text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)", isBetween(value, selected ?? {}) && "rounded-none bg-(--menu-accent)", (start || end) && "bg-(--menu-foreground) text-(--menu-background) hover:bg-(--menu-foreground) hover:text-(--menu-background)")}>{label}</button>; })}</div></div>;
}
