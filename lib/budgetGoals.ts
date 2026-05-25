import {
  doc, setDoc, getDoc,
  collection, getDocs, deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type BudgetGoal = {
  category: string;
  limit: number;
  updatedAt: number;
};

export async function setGoal(uid: string, category: string, limit: number) {
  const ref = doc(db, "users", uid, "budgetGoals", category);
  await setDoc(ref, { category, limit, updatedAt: Date.now() });
}

export async function getGoal(uid: string, category: string): Promise<BudgetGoal | null> {
  const ref = doc(db, "users", uid, "budgetGoals", category);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as BudgetGoal) : null;
}

export async function getAllGoals(uid: string): Promise<BudgetGoal[]> {
  const ref = collection(db, "users", uid, "budgetGoals");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as BudgetGoal);
}

export async function deleteGoal(uid: string, category: string) {
  const ref = doc(db, "users", uid, "budgetGoals", category);
  await deleteDoc(ref);
}