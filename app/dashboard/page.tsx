"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { listenToExpenses, Expense } from "@/lib/firestore";
import DashboardNavbar  from "@/components/dashboard/DashboardNavbar";
import StatsCards from "@/components/dashboard/StatsCards";
import AddExpenseForm from "@/components/dashboard/AddExpenseForm";
import ExpenseList from "@/components/dashboard/ExpenseList";
import AIInsights       from "@/components/dashboard/AIInsights";
import Charts from "@/components/dashboard/Charts";
import BudgetGoals from "@/components/dashboard/BudgetGoals";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToExpenses(user.uid, setExpenses);
    return () => unsubscribe();
  }, [user]);

  if (loading || !user) return null;

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
    }}>
      <DashboardNavbar />

      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "36px 20px",
      }}>
        {/* Greeting */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            color: "#fff",
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "4px",
            letterSpacing: "-0.03em",
          }}>
            Hey {user.displayName?.split(" ")[0] ?? "there"} !
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            Track your spending, stay on budget.
          </p>
        </div>

        {/* Components */}
        <StatsCards expenses={expenses} />
        <BudgetGoals />
        <AddExpenseForm />
        <AIInsights expenses={expenses} />
        <Charts expenses={expenses} />
        <ExpenseList expenses={expenses} />
      </main>
    </div>
  );
}