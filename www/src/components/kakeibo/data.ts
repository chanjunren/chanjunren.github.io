import { type ChartConfig } from "@site/src/components/ui/chart";

// These fixtures mirror the JSON returned by Backies' Kakeibo endpoints.
export const mockSpecsResponse = {
  availableMonths: [
    { month: "2026-08", transactionCount: 42, uncategorizedCount: 3 },
    { month: "2026-07", transactionCount: 39, uncategorizedCount: 1 },
  ],
  defaultMonth: "2026-08",
  categories: {
    2: { id: 2, name: "Salary", priority: 10, ruleCount: 1 },
    7: { id: 7, name: "Transport", priority: 100, ruleCount: 4 },
    8: { id: 8, name: "Food & Dining", priority: 110, ruleCount: 8 },
    9: { id: 9, name: "Shopping", priority: 120, ruleCount: 3 },
    10: { id: 10, name: "Bills", priority: 130, ruleCount: 6 },
  },
  accounts: [
    {
      id: 1,
      name: "daily",
      displayName: "***-1234",
      bank: "DBS",
      currency: "SGD",
      accountType: "current",
    },
  ],
  transactionTypes: ["debit", "credit"],
  categorizationStatuses: ["categorized", "uncategorized"],
};

export const mockDashboardResponse = {
  from: "2026-05",
  to: "2026-08",
  totalOut: "2434.56",
  totalIn: "3800.00",
  net: "1365.44",
  uncategorizedCount: 3,
  spendByCategory: [
    { categoryId: 8, total: "420.10", count: 18 },
    { categoryId: 7, total: "236.40", count: 8 },
    { categoryId: 9, total: "198.75", count: 7 },
    { categoryId: 10, total: "179.31", count: 6 },
  ],
  monthlySpend: [
    { month: "2026-05", totalOut: "0.00", totalIn: "0.00", net: "0.00" },
    { month: "2026-06", totalOut: "0.00", totalIn: "0.00", net: "0.00" },
    {
      month: "2026-07",
      totalOut: "1200.00",
      totalIn: "800.00",
      net: "-400.00",
    },
    {
      month: "2026-08",
      totalOut: "1234.56",
      totalIn: "3000.00",
      net: "1765.44",
    },
  ],
  processedFiles: [
    {
      sourceFileId: "local:dbs_2608.csv:mock",
      fileName: "dbs_2608.csv",
      accountId: 1,
      parserKey: "dbs-csv-v1",
      periodStart: "2026-08-01T00:00:00Z",
      periodEnd: "2026-08-31T00:00:00Z",
      processedAt: "2026-09-06T04:00:03Z",
      status: "success",
    },
    {
      sourceFileId: "local:uob_2607.pdf:mock",
      fileName: "uob_2607.pdf",
      accountId: 1,
      parserKey: "uob-pdf-v1",
      periodStart: "2026-07-01T00:00:00Z",
      periodEnd: "2026-07-31T00:00:00Z",
      processedAt: "2026-08-06T04:00:03Z",
      status: "failed",
    },
  ],
};

export const mockTransactionsResponse = [
  {
    id: 101,
    accountId: 1,
    transactionDate: "2026-08-28",
    description: "FairPrice Finest",
    amount: "86.40",
    type: "debit",
    categoryId: 8,
    sourceFileId: "drive-august-2026",
    createdAt: "2026-08-28T04:00:00Z",
    category: mockSpecsResponse.categories[8],
  },
  {
    id: 102,
    accountId: 1,
    transactionDate: "2026-08-27",
    description: "Grab Singapore",
    amount: "18.20",
    type: "debit",
    categoryId: 7,
    sourceFileId: "drive-august-2026",
    createdAt: "2026-08-27T04:00:00Z",
    category: mockSpecsResponse.categories[7],
  },
  {
    id: 103,
    accountId: 1,
    transactionDate: "2026-08-26",
    description: "Monthly salary",
    amount: "3000.00",
    type: "credit",
    categoryId: 2,
    sourceFileId: "drive-august-2026",
    createdAt: "2026-08-26T04:00:00Z",
    category: mockSpecsResponse.categories[2],
  },
  {
    id: 104,
    accountId: 1,
    transactionDate: "2026-08-25",
    description: "Muji Plaza Singapura",
    amount: "74.90",
    type: "debit",
    categoryId: 9,
    sourceFileId: "drive-august-2026",
    createdAt: "2026-08-25T04:00:00Z",
    category: mockSpecsResponse.categories[9],
  },
  {
    id: 105,
    accountId: 1,
    transactionDate: "2026-08-24",
    description: "SP Services",
    amount: "112.55",
    type: "debit",
    categoryId: 10,
    sourceFileId: "drive-august-2026",
    createdAt: "2026-08-24T04:00:00Z",
    category: mockSpecsResponse.categories[10],
  },
];

export const mockCategoryRulesResponse = [
  ...Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    categoryId: 8,
    keyword: `food-${index + 1}`,
    createdAt: "2026-08-01T00:00:00Z",
  })),
  ...Array.from({ length: 4 }, (_, index) => ({
    id: index + 9,
    categoryId: 7,
    keyword: `transport-${index + 1}`,
    createdAt: "2026-08-01T00:00:00Z",
  })),
  ...Array.from({ length: 3 }, (_, index) => ({
    id: index + 13,
    categoryId: 9,
    keyword: `shopping-${index + 1}`,
    createdAt: "2026-08-01T00:00:00Z",
  })),
  ...Array.from({ length: 6 }, (_, index) => ({
    id: index + 16,
    categoryId: 10,
    keyword: `bills-${index + 1}`,
    createdAt: "2026-08-01T00:00:00Z",
  })),
  {
    id: 22,
    categoryId: 2,
    keyword: "salary",
    createdAt: "2026-08-01T00:00:00Z",
  },
];

export const categories = Object.values(mockSpecsResponse.categories).map(
  (category) => ({ name: category.name, rules: category.ruleCount }),
);

export const cashFlow = [
  {
    direction: "Money in",
    amount: Number(mockDashboardResponse.totalIn),
    fill: "var(--color-moneyIn)",
  },
  {
    direction: "Money out",
    amount: Number(mockDashboardResponse.totalOut),
    fill: "var(--color-moneyOut)",
  },
];
export const cashFlowChartConfig = {
  amount: { label: "Amount" },
  moneyIn: { label: "Revenue", color: "var(--chart-2)" },
  moneyOut: { label: "Expenses", color: "var(--chart-1)" },
} satisfies ChartConfig;
export const monthlySpend = mockDashboardResponse.monthlySpend.map((item) => ({
  ...item,
  totalOut: Number(item.totalOut),
  totalIn: Number(item.totalIn),
  net: Number(item.net),
}));
export const monthlySpendChartConfig = {
  totalOut: { label: "Expenses", color: "var(--chart-1)" },
  totalIn: { label: "Revenue", color: "var(--chart-2)" },
  net: { label: "Net", color: "var(--foreground)" },
} satisfies ChartConfig;
export const spendByCategory = mockDashboardResponse.spendByCategory
  .map((item) => ({
    categoryId: item.categoryId,
    category:
      Object.values(mockSpecsResponse.categories).find(
        (category) => category.id === item.categoryId,
      )?.name ?? "Unknown",
    total: Number(item.total),
    count: item.count,
  }))
  .sort((left, right) => right.total - left.total);
export const spendByCategoryChartConfig = {
  total: { label: "Spend", color: "var(--foreground)" },
} satisfies ChartConfig;
export const transactions = mockTransactionsResponse.map((transaction) => ({
  date: new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${transaction.transactionDate}T00:00:00`)),
  merchant: transaction.description,
  category: transaction.category?.name ?? "Uncategorized",
  amount: `${transaction.type === "credit" ? "+" : "−"}$${transaction.amount}`,
  income: transaction.type === "credit",
}));
