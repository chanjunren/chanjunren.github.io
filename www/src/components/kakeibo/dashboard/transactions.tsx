import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@site/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@site/src/components/ui/table";
import { cn } from "@site/src/lib/utils";
import { useState } from "react";
import { categories, transactions } from "../data";
import { CategoryTag } from "../shared";

export function Transactions() {
  const [category, setCategory] = useState("all");
  const filteredTransactions =
    category === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.category === category);
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <span className="font-mono text-lg font-normal">Transactions</span>
        </CardTitle>
        <CardAction>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filter transactions by category">
              {category === "all" ? "All categories" : category}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={`${transaction.date}-${transaction.merchant}`}>
                <TableCell>
                  <span className="text-muted-foreground">
                    {transaction.date}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{transaction.merchant}</span>
                </TableCell>
                <TableCell>
                  <CategoryTag>{transaction.category}</CategoryTag>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono font-medium",
                      transaction.income ? "text-chart-2" : "text-foreground",
                    )}
                  >
                    {transaction.amount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
