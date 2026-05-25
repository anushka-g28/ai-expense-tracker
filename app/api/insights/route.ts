// Server-side API route.
// Receives expenses from the frontend, sends to Gemini, returns insights.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { expenses } = await req.json();

    if (!expenses || expenses.length === 0) {
      return NextResponse.json(
        { error: "No expenses to analyze." },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build a summary of expenses to send to Gemini
    const total = expenses.reduce(
      (sum: number, e: { amount: number }) => sum + e.amount,
      0
    );

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e: { category: string; amount: number }) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: ₹${amt}`)
      .join(", ");

    const expenseList = expenses
      .slice(0, 20) // send max 20 expenses
      .map(
        (e: { category: string; note: string; amount: number }) =>
          `${e.category} - ${e.note || "no note"} - ₹${e.amount}`
      )
      .join("\n");

    // The prompt we send to Gemini
    const prompt = `
You are SpendAI, a smart and friendly personal finance coach.

Analyze the user's weekly expenses and provide practical, data-driven insights.

SPENDING DATA

Total spent: ₹${total}
Total expenses: ${expenses.length}

Category breakdown:
${categoryBreakdown}

Expenses:
${expenseList}

INSTRUCTIONS

- Be concise and natural.
- Use a supportive, conversational tone.
- Mention actual categories and amounts from the data.
- Do NOT give generic financial advice.
- Focus on patterns, overspending, and realistic savings.
- Keep the response under 120 words.
- Use Indian Rupee symbol (₹).

OUTPUT FORMAT

#Weekly Summary
(1-2 sentences)

#Spending Pattern
(mention highest/unusual spending category)

#Smart Tip
(one actionable suggestion)

#Budget Recommendation
(a realistic weekly spending target)
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ insights: text });
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error("Gemini error:", e.message);
    return NextResponse.json(
      { error: "Failed to generate insights." },
      { status: 500 }
    );
  }
}