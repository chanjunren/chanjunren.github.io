import { Plus } from "lucide-react";
import { useState } from "react";
import * as React from "react";
import { Button } from "@site/src/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@site/src/components/ui/dialog";
import { Input } from "@site/src/components/ui/input";
import { Separator } from "@site/src/components/ui/separator";
import {
  useCategories,
  useCreateCategory,
  useCreateRule,
  useRules,
} from "../hooks";
import { CategoryTag } from "../shared";

function LoadingCard() {
  return (
    <Card className="mt-4">
      <CardContent className="py-8 text-base text-muted-foreground">
        Loading categories…
      </CardContent>
    </Card>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mt-4">
      <CardContent className="py-8 text-base text-destructive">
        {message}
      </CardContent>
    </Card>
  );
}

export function Categories() {
  const categories = useCategories();
  const rules = useRules();
  const createCategory = useCreateCategory();
  const createRule = useCreateRule();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [ruleCategoryId, setRuleCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [keyword, setKeyword] = useState("");

  if (categories.isPending || rules.isPending) return <LoadingCard />;
  if (categories.isError)
    return <ErrorCard message={categories.error.message} />;
  if (rules.isError) return <ErrorCard message={rules.error.message} />;

  const categoryList = categories.data ?? [];
  const ruleList = rules.data ?? [];
  const selectedRuleCategory = categoryList.find(
    (category) => category.id === ruleCategoryId,
  );

  function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    createCategory.mutate(name, {
      onSuccess: () => {
        setCategoryName("");
        setCategoryDialogOpen(false);
      },
    });
  }

  function submitRule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!ruleCategoryId || !trimmedKeyword) return;

    createRule.mutate(
      { categoryId: ruleCategoryId, keyword: trimmedKeyword },
      {
        onSuccess: () => {
          setKeyword("");
          setRuleCategoryId(null);
        },
      },
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <span className="font-mono text-lg font-normal">Categories</span>
        </CardTitle>
        <CardDescription className="text-base">
          Rules automatically categorize matching transactions.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            className="text-base"
            onClick={() => setCategoryDialogOpen(true)}
          >
            <Plus data-icon="inline-start" aria-hidden="true" />
            Add category
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {categoryList.map((category, index) => {
            const categoryRules = ruleList.filter(
              (rule) => rule.categoryId === category.id,
            );
            return (
              <div key={category.id}>
                <div className="flex items-start gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <CategoryTag>{category.name}</CategoryTag>
                    {categoryRules.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {categoryRules.map((rule) => (
                          <span
                            key={rule.id}
                            className="inline-flex items-center rounded border px-2 py-1 font-mono text-sm"
                          >
                            {rule.keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setKeyword("");
                      setRuleCategoryId(category.id);
                    }}
                  >
                    <Plus data-icon="inline-start" aria-hidden="true" />
                    Add rule
                  </Button>
                </div>
                {index < categoryList.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>
              Create a category for organizing your transactions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCategory}>
            <label className="flex flex-col gap-2 text-sm">
              <span>Category name</span>
              <Input
                autoFocus
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="e.g. Travel"
              />
            </label>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createCategory.isPending || !categoryName.trim()}
              >
                Save category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={ruleCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) setRuleCategoryId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add rule</DialogTitle>
            <DialogDescription>
              Add a keyword that should be categorized as {selectedRuleCategory?.name ?? "this category"}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRule}>
            <label className="flex flex-col gap-2 text-sm">
              <span>Keyword</span>
              <Input
                autoFocus
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="e.g. grab"
              />
            </label>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createRule.isPending || !keyword.trim()}
              >
                Save rule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
