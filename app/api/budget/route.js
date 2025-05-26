import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/config/db";
import Budget from "@/models/Budget";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const budget = await Budget.findOne({
      userId: user._id,
      month: currentMonth,
    });

    console.log("Budget found: ", budget);

    return NextResponse.json(
      { message: "Budget found", budget },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/budget error", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      await connectDB();
  
      const user = await User.findOne({ email: session.user.email });
      const { amount, month } = await req.json();
  
      if (!amount || !month) {
        return NextResponse.json(
          { error: "Amount and month are required." },
          { status: 400 }
        );
      }
  
      // Optional: overwrite if already exists
      const existingBudget = await Budget.findOne({ userId: user._id, month });
  
      if (existingBudget) {
        existingBudget.amount = amount;
        await existingBudget.save();
  
        return NextResponse.json(
          { message: "Budget updated successfully", budget: existingBudget },
          { status: 200 }
        );
      }
  
      const newBudget = new Budget({
        userId: user._id,
        amount,
        month,
      });
  
      await newBudget.save();
  
      return NextResponse.json(
        { message: "Budget created successfully", budget: newBudget },
        { status: 201 }
      );
    } catch (error) {
      console.error("POST /api/budget error", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
  }
  