import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/config/db";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    const { amount, description, date } = await req.json();

    if (!amount || !description || !date) {
      return NextResponse.json(
        { error: "Amount, description, and date are required" },
        { status: 400 }
      );
    }

    const newExpense = new Expense({
      userId: user._id,
      amount,
      description,
      date: new Date(date),
    });

    await newExpense.save();

    return NextResponse.json(
      { message: "Expense recorded successfully", expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/expense error", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await connectDB();
  
      const user = await User.findOne({ email: session.user.email });
  
      const expenses = await Expense.find({ userId: user._id }).sort({ date: -1 });
  
      return NextResponse.json(
        { message: "Expenses fetched successfully", expenses },
        { status: 200 }
      );
    } catch (error) {
      console.error("GET /api/expense error", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
  
