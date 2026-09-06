import { Button } from "@site/src/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import { Separator } from "@site/src/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { categories } from "../data";
import { CategoryTag } from "../shared";

export function Categories() {
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
          <Button variant="outline" size="sm" className="text-base">
            <Plus data-icon="inline-start" aria-hidden="true" />
            Add rule
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {categories.map((category, index) => (
            <div key={category.name}>
              <div className="flex items-center gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <CategoryTag>{category.name}</CategoryTag>
                  <p className="m-0 mt-1 text-base text-(--reduced-emphasis-color)">
                    {category.rules} matching rules
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              {index < categories.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
