import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import { BudgetGoal } from "./budgetGoals";
import { getDocs } from "firebase/firestore";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  createdAt: Timestamp;
  userId: string;
}

export const CATEGORIES = [
  "Food", "Transport", "Shopping",
  "Entertainment", "Health", "Bills", "Education", "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food:          "#f97316",
  Transport:     "#3b82f6",
  Shopping:      "#a855f7",
  Entertainment: "#ec4899",
  Health:        "#22c55e",
  Bills:         "#ef4444",
  Education:     "#06b6d4",
  Other:         "#6b7280",
};

export async function addExpense(
  userId: string,
  amount: number,
  category: string,
  note: string
) {
  await addDoc(collection(db, "expenses"), {
    userId,
    amount,
    category,
    note,
    createdAt: Timestamp.now(),
  });
}

export async function deleteExpense(id: string) {
  await deleteDoc(doc(db, "expenses", id));
}

export function listenToExpenses(
  userId: string,
  callback: (expenses: Expense[]) => void
) {
  // Simple query - no orderBy, no complex rules needed
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Expense[];

      data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      callback(data);
    },
    (error) => {
      console.error("Firestore error:", error.code, error.message);
    }
  );
}

export function getTotalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getTopCategory(expenses: Expense[]): string {
  const totals: Record<string, number> = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
}

export async function getExpenses(uid: string, month: number, year: number) {
  const ref = collection(db, "expenses");
  const q = query(ref, where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Expense))
    .filter((e) => {
      const d = e.createdAt?.toDate ? e.createdAt.toDate() : new Date();
      return d.getMonth() === month && d.getFullYear() === year;
    });
}