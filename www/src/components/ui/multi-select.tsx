import { useState, type ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@site/src/components/ui/select";
import { Badge } from "@site/src/components/ui/badge";
import { X } from "lucide-react";

export type MultiSelectOption = {
  value: string;
  label: ReactNode;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  "aria-label": ariaLabel,
}: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);

  const toggleValue = (selectedValue: string) => {
    onChange(
      value.includes(selectedValue)
        ? value.filter((current) => current !== selectedValue)
        : [...value, selectedValue],
    );
    queueMicrotask(() => setOpen(true));
  };

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      onValueChange={toggleValue}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-auto min-h-9 w-full justify-between gap-2 py-1.5"
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1">
          {value.length > 0 ? (
            value.map((selectedValue) => {
              const option = options.find((item) => item.value === selectedValue);
              return (
                <Badge
                  key={selectedValue}
                  variant="outline"
                  className="font-normal"
                  role="button"
                  tabIndex={0}
                  title={`Remove ${String(option?.label ?? selectedValue)}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleValue(selectedValue);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleValue(selectedValue);
                    }
                  }}
                >
                  {option?.label ?? selectedValue}
                  <X aria-hidden="true" />
                </Badge>
              );
            })
          ) : (
            placeholder
          )}
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={
              value.includes(option.value)
                ? "bg-(--menu-accent) text-(--menu-foreground)"
                : undefined
            }
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
