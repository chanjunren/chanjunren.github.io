import { useHistory, useLocation } from "@docusaurus/router";

import { Button } from "@site/src/components/ui/button";
import { Input } from "@site/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@site/src/components/ui/dialog";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { Popover, PopoverContent, PopoverTrigger } from "@site/src/components/ui/popover";
import CustomTag from "@site/src/components/ui/custom-tag";
import { MultiSelect } from "@site/src/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@site/src/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Account, MonthRange, TransactionType } from "../api";
import { DateRangePicker } from "./date-range-picker";

export type KakeiboFilters = MonthRange & {
  accountId?: number;
  categoryIds: number[];
  excludeCategoryIds: number[];
  includeUncategorized: boolean;
  excludeUncategorized: boolean;
  types: TransactionType[];
};

const defaults: KakeiboFilters = {
  from: "2026-05",
  to: "2026-08",
  categoryIds: [],
  excludeCategoryIds: [],
  includeUncategorized: false,
  excludeUncategorized: false,
  types: [],
};

function parseFilters(search: string): KakeiboFilters {
  const params = new URLSearchParams(search);
  const numberList = (key: string) =>
    params.getAll(key).flatMap((value) => {
      const number = Number(value);
      return Number.isInteger(number) && number > 0 ? [number] : [];
    });
  const categoryValues = params.getAll("categoryId");
  const excludedValues = params.getAll("excludeCategoryId");
  const uncategorized = (values: string[]) => values.includes("uncategorized");
  const types = params
    .getAll("type")
    .filter(
      (type): type is TransactionType => type === "debit" || type === "credit",
    );
  return {
    from: params.get("from") || defaults.from,
    to: params.get("to") || defaults.to,
    accountId: numberList("accountId")[0],
    categoryIds: categoryValues
      .flatMap((value) => (value === "uncategorized" ? [] : Number(value)))
      .filter((value) => Number.isInteger(value) && value > 0),
    excludeCategoryIds: excludedValues
      .flatMap((value) => (value === "uncategorized" ? [] : Number(value)))
      .filter((value) => Number.isInteger(value) && value > 0),
    includeUncategorized: uncategorized(categoryValues),
    excludeUncategorized: uncategorized(excludedValues),
    types: [...new Set(types)],
  };
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1">
        <MonoLabel>{label}</MonoLabel>
      </legend>
      {children}
    </fieldset>
  );
}

export function useKakeiboFilters() {
  const location = useLocation();
  const history = useHistory();
  const [filters, setFilters] = useState(() => parseFilters(location.search));
  useEffect(() => setFilters(parseFilters(location.search)), [location.search]);
  const setFilter = (next: KakeiboFilters) => {
    const params = new URLSearchParams();
    if (next.from !== defaults.from) params.set("from", next.from);
    if (next.to !== defaults.to) params.set("to", next.to);
    if (next.accountId) params.set("accountId", String(next.accountId));
    next.categoryIds.forEach((id) => params.append("categoryId", String(id)));
    if (next.includeUncategorized) params.append("categoryId", "uncategorized");
    next.excludeCategoryIds.forEach((id) =>
      params.append("excludeCategoryId", String(id)),
    );
    if (next.excludeUncategorized)
      params.append("excludeCategoryId", "uncategorized");
    next.types.forEach((type) => params.append("type", type));
    history.replace(
      `${location.pathname}${params.toString() ? `?${params}` : ""}`,
    );
    setFilters(next);
  };
  return [filters, setFilter] as const;
}

export function FilterButton({
  filters,
  accounts,
  categories,
  onChange,
}: {
  filters: KakeiboFilters;
  accounts: Account[];
  categories: Array<{ id: number; name: string }>;
  onChange: (filters: KakeiboFilters) => void;
}) {
  const activeCount =
    filters.categoryIds.length +
    filters.excludeCategoryIds.length +
    filters.types.length +
    Number(filters.includeUncategorized) +
    Number(filters.excludeUncategorized) +
    Number(Boolean(filters.accountId));
  const update = (changes: Partial<KakeiboFilters>) =>
    onChange({ ...filters, ...changes });
  const categoryOptions = useMemo(() => categories, [categories]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" aria-label="Open Kakeibo filters">
          <SlidersHorizontal aria-hidden="true" />
          <MonoLabel className="text-inherit">Filters</MonoLabel>
          {activeCount > 0 && (
            <CustomTag color="locked" className="font-mono text-xs">
              {activeCount}
            </CustomTag>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            <MonoLabel className="text-foreground">🍉 Filters</MonoLabel>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <section className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <MonoLabel>Date range</MonoLabel>
            <DateRangePicker
              value={filters}
              onChange={(range) => update(range)}
            />
          </section>
          <section className="grid gap-3">
            <MonoLabel>Account</MonoLabel>
            <Select
              value={filters.accountId ? String(filters.accountId) : "all"}
              onValueChange={(value) =>
                update({
                  accountId: value === "all" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger aria-label="Filter by account" className="w-full">
                {filters.accountId
                  ? (accounts.find(
                      (account) => account.id === filters.accountId,
                    )?.displayName ?? "Account")
                  : "All accounts"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {account.name} · {account.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>
          <section className="grid gap-5">
            <FilterGroup label="Included">
              <MultiSelect
                options={categoryOptions.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                }))}
                value={filters.categoryIds.map(String)}
                onChange={(values) =>
                  update({ categoryIds: values.map(Number) })
                }
                placeholder="Select category"
                aria-label="Select included categories"
              />
              <Button
                type="button"
                variant="outline"
                className={
                  filters.includeUncategorized
                    ? "bg-(--menu-foreground)! text-(--menu-background)! hover:bg-(--menu-foreground)! hover:text-(--menu-background)!"
                    : "text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)"
                }
                aria-pressed={filters.includeUncategorized}
                onClick={() =>
                  update({
                    includeUncategorized: !filters.includeUncategorized,
                    excludeUncategorized: false,
                  })
                }
              >
                <MonoLabel className="text-inherit">Uncategorized</MonoLabel>
              </Button>
            </FilterGroup>
            <FilterGroup label="Excluded">
              <MultiSelect
                options={categoryOptions.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                }))}
                value={filters.excludeCategoryIds.map(String)}
                onChange={(values) =>
                  update({ excludeCategoryIds: values.map(Number) })
                }
                placeholder="Select category"
                aria-label="Select excluded categories"
              />
              <Button
                type="button"
                variant="outline"
                className={
                  filters.excludeUncategorized
                    ? "bg-(--menu-foreground)! text-(--menu-background)! hover:bg-(--menu-foreground)! hover:text-(--menu-background)!"
                    : "text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)"
                }
                aria-pressed={filters.excludeUncategorized}
                onClick={() =>
                  update({
                    excludeUncategorized: !filters.excludeUncategorized,
                    includeUncategorized: false,
                  })
                }
              >
                <MonoLabel className="text-inherit">Uncategorized</MonoLabel>
              </Button>
            </FilterGroup>
          </section>
          <section className="grid gap-3">
            <FilterGroup label="Transaction type">
              <div className="grid gap-2 sm:grid-cols-2">
                {(["debit", "credit"] as TransactionType[]).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    className={
                      filters.types.includes(type)
                        ? "bg-(--menu-foreground)! text-(--menu-background)! hover:bg-(--menu-foreground)! hover:text-(--menu-background)!"
                        : "text-(--menu-foreground) hover:bg-(--menu-accent) hover:text-(--menu-foreground)"
                    }
                    aria-pressed={filters.types.includes(type)}
                    onClick={() =>
                      update({
                        types: filters.types.includes(type)
                          ? filters.types.filter((current) => current !== type)
                          : [...filters.types, type],
                      })
                    }
                  >
                    <MonoLabel className="text-inherit">{type}</MonoLabel>
                  </Button>
                ))}
              </div>
            </FilterGroup>
          </section>
          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange(defaults)}
            >
              Clear filters
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
