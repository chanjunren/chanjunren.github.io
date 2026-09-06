import Head from "@docusaurus/Head";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Plus,
  Trash2,
} from "lucide-react";
import { type CSSProperties, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@site/src/components/ui/badge";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@site/src/components/ui/chart";
import CustomTag from "@site/src/components/ui/custom-tag";
import { Field, FieldGroup, FieldLabel } from "@site/src/components/ui/field";
import { Input } from "@site/src/components/ui/input";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { Separator } from "@site/src/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@site/src/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@site/src/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@site/src/components/ui/tooltip";
import { cn } from "@site/src/lib/utils";

type Screen = "login" | "kakeibo";

const spendByCategory = [
  { category: "Food & Dining", total: 420.1, fill: "var(--color-food)" },
  { category: "Transport", total: 236.4, fill: "var(--color-transport)" },
  { category: "Shopping", total: 198.75, fill: "var(--color-shopping)" },
  { category: "Bills", total: 179.31, fill: "var(--color-bills)" },
  {
    category: "Uncategorized",
    total: 200,
    fill: "var(--color-uncategorized)",
  },
];

const chartConfig = {
  total: { label: "Spend" },
  food: { label: "Food & Dining", color: "var(--chart-1)" },
  transport: { label: "Transport", color: "var(--chart-2)" },
  shopping: { label: "Shopping", color: "var(--chart-3)" },
  bills: { label: "Bills", color: "var(--chart-4)" },
  uncategorized: {
    label: "Uncategorized",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const cashFlow = [
  { direction: "Money in", amount: 3000, fill: "var(--color-moneyIn)" },
  { direction: "Money out", amount: 1234.56, fill: "var(--color-moneyOut)" },
];

const cashFlowChartConfig = {
  amount: { label: "Amount" },
  moneyIn: { label: "Money in", color: "var(--chart-2)" },
  moneyOut: { label: "Money out", color: "var(--chart-1)" },
} satisfies ChartConfig;

const transactions = [
  {
    date: "28 Aug",
    merchant: "FairPrice Finest",
    category: "Food & Dining",
    amount: "−$86.40",
  },
  {
    date: "27 Aug",
    merchant: "Grab Singapore",
    category: "Transport",
    amount: "−$18.20",
  },
  {
    date: "26 Aug",
    merchant: "Monthly salary",
    category: "Salary",
    amount: "+$3,000.00",
    income: true,
  },
  {
    date: "25 Aug",
    merchant: "Muji Plaza Singapura",
    category: "Shopping",
    amount: "−$74.90",
  },
  {
    date: "24 Aug",
    merchant: "SP Services",
    category: "Bills",
    amount: "−$112.55",
  },
];

const categories = [
  { name: "Food & Dining", rules: 8, total: "$420.10" },
  { name: "Transport", rules: 4, total: "$236.40" },
  { name: "Shopping", rules: 3, total: "$198.75" },
  { name: "Bills", rules: 6, total: "$179.31" },
  { name: "Salary", rules: 1, total: "$3,000.00" },
];

function CategoryTag({
  children,
  markerColor,
}: {
  children: string;
  markerColor?: string;
}) {
  return (
    <CustomTag
      color="neutral"
      className="inline-flex! items-center gap-1.5 text-sm! font-normal"
    >
      {markerColor && (
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: markerColor }}
        />
      )}
      {children}
    </CustomTag>
  );
}

function Wordmark() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="w-fit border-0 bg-transparent p-0">
          <CustomTag color="rose" className="text-base! font-semibold">
            うち
          </CustomTag>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="max-w-64 leading-relaxed"
      >
        うち (uchi)
        <br />
        meaning home, inside, or one&apos;s inner circle
        <br />
        <br />
        my secret projects
      </TooltipContent>
    </Tooltip>
  );
}

function LoginMockup({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("joyce@example.com");

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-background px-6 py-12">
      <div className="relative w-full max-w-xs">
        <div className="absolute bottom-full left-0 mb-8">
          <Wordmark />
        </div>
        {step === "email" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep("password");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="portal-email">Email</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="portal-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoFocus
                  />
                  <Button type="submit" variant="outline" size="icon" aria-label="Continue to password">
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onContinue();
            }}
          >
            <FieldGroup>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="portal-password">Password</FieldLabel>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setStep("email")}
                  >
                    {email}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="portal-password"
                    type="password"
                    autoComplete="current-password"
                    defaultValue="password123"
                    required
                    autoFocus
                  />
                  <Button type="submit" variant="outline" size="icon" aria-label="Sign in">
                    <LogIn aria-hidden="true" />
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        )}
      </div>
    </main>
  );
}

function PortalSidebar() {
  return (
    <aside className="relative hidden w-72 shrink-0 bg-background lg:flex lg:flex-col">
      <div className="absolute bottom-8 right-0 top-8 w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)]" />
      <div className="px-6 pt-8">
        <Wordmark />
      </div>
      <div className="mt-10 flex min-h-0 flex-1 flex-col gap-8 overflow-auto px-6 pb-8">
        <nav className="flex flex-col items-start gap-1" aria-label="Applications">
          <button
            type="button"
            data-active="true"
            className="flex h-9 w-fit cursor-pointer items-center rounded-md border border-border bg-(--menu-muted-background) px-2 text-left text-base font-medium tracking-tight text-(--menu-foreground) transition-colors hover:bg-(--menu-accent)! hover:text-(--menu-foreground)!"
          >
            Kakeibo
          </button>
        </nav>
      </div>
    </aside>
  );
}

function CashFlowSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Cash flow</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.35fr)]">
        <div className="min-w-0">
          <ChartContainer config={cashFlowChartConfig} className="h-48 w-full aspect-auto">
            <BarChart accessibilityLayer data={cashFlow} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="direction" type="category" tickLine={false} axisLine={false} width={72} />
              <XAxis dataKey="amount" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="amount" radius={6} maxBarSize={36}>
                {cashFlow.map((entry) => <Cell key={entry.direction} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col justify-center gap-3 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <MonoLabel>Net</MonoLabel>
          <span className="font-mono text-4xl font-semibold tracking-tight text-chart-2">+$1,765.44</span>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <CashFlowSummary />

      <Card>
        <CardHeader>
          <CardTitle>
            <MonoLabel>Spending by category</MonoLabel>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid items-center gap-6 sm:grid-cols-[240px_1fr]">
            <div className="relative mx-auto size-56">
              <ChartContainer
                config={chartConfig}
                className="aspect-square size-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={spendByCategory}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={62}
                    outerRadius={88}
                    strokeWidth={4}
                  >
                    {spendByCategory.map((entry) => (
                      <Cell key={entry.category} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base text-(--reduced-emphasis-color)">
                  Total spent
                </span>
                <span className="font-mono text-lg font-semibold">
                  $1,234.56
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {spendByCategory.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="min-w-0 flex-1 text-base">
                    {item.category}
                  </span>
                  <span className="font-mono text-base font-medium">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsTab() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <span className="font-mono text-lg font-normal">Transactions</span>
        </CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="text-base">
            All categories
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
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
            {transactions.map((transaction) => (
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

function CategoriesTab() {
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
                <span className="font-mono text-base">{category.total}</span>
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

function KakeiboMockup() {
  return (
    <main
      className="flex min-h-[calc(100vh-57px)] bg-background text-base text-foreground [&_[data-slot=button]]:text-base"
      style={
        {
          "--background": "var(--menu-background)",
          "--foreground": "var(--menu-foreground)",
          "--card": "var(--menu-background)",
          "--card-foreground": "var(--menu-foreground)",
          "--muted": "var(--menu-muted-background)",
          "--muted-foreground": "var(--menu-subtle)",
          "--accent": "var(--menu-accent)",
          "--accent-foreground": "var(--menu-accent-foreground)",
          "--chart-1": "#b4637a",
          "--chart-2": "#286983",
          "--chart-3": "#56949f",
          "--chart-4": "#907aa9",
        } as CSSProperties
      }
    >
      <PortalSidebar />
      <section className="min-w-0 flex-1">
        <div className="px-5 pt-5 lg:hidden"><Wordmark /></div>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-5 lg:p-10">
          <div className="flex justify-end">
            <div className="flex items-center rounded-lg border bg-background p-1 shadow-xs">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Previous month"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm">
                August 2026
                <ChevronDown data-icon="inline-end" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Next month">
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList variant="line" aria-label="Kakeibo sections">
              <TabsTrigger value="overview">
                <MonoLabel className="text-inherit">Overview</MonoLabel>
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <MonoLabel className="text-inherit">Transactions</MonoLabel>
              </TabsTrigger>
              <TabsTrigger value="categories">
                <MonoLabel className="text-inherit">Categories</MonoLabel>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionsTab />
            </TabsContent>
            <TabsContent value="categories">
              <CategoriesTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

export default function KakeiboMockups() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <>
      <Head>
        <title>Personal portal mockups</title>
        <meta
          name="description"
          content="Interactive personal portal and Kakeibo mockups."
        />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <div className="sticky top-0 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Portal mockups</span>
            <Badge variant="outline">Concept 02</Badge>
          </div>
          <div
            className="flex items-center gap-1 rounded-lg bg-muted p-1"
            aria-label="Choose mockup"
          >
            <Button
              variant={screen === "login" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setScreen("login")}
            >
              Login
            </Button>
            <Button
              variant={screen === "kakeibo" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setScreen("kakeibo")}
            >
              Kakeibo
            </Button>
          </div>
        </div>
        {screen === "login" ? (
          <LoginMockup onContinue={() => setScreen("kakeibo")} />
        ) : (
          <KakeiboMockup />
        )}
      </div>
    </>
  );
}
