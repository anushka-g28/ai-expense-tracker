import { NextRequest, NextResponse } from "next/server";

export type AlertLevel = "over" | "warning" | "ok";

export type BudgetAlert = {
  category: string;
  spent: number;
  limit: number;
  percent: number;      
  level: AlertLevel;    // "over" ≥100%, "warning" ≥80%, "ok" <80%
};

type RequestBody = {
  goals: { category: string; limit: number }[];
  spending: Record<string, number>; // { Food: 3200, Transport: 800, ... }
};

export async function POST(req: NextRequest) {
  const { goals, spending }: RequestBody = await req.json();

  const alerts: BudgetAlert[] = goals.map(({ category, limit }) => {
    const spent = spending[category] ?? 0;
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const level: AlertLevel =
      percent >= 100 ? "over" : percent >= 80 ? "warning" : "ok";

    return { category, spent, limit, percent, level };
  });

  alerts.sort((a, b) => {
    const order = { over: 0, warning: 1, ok: 2 };
    return order[a.level] - order[b.level];
  });

  return NextResponse.json(alerts);
}