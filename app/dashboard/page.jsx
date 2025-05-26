import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import BudgetSection from "@/components/dashboard/BudgetSection";
import ExpenseSection from "@/components/dashboard/ExpenseSection";
import ReportsSection from "@/components/dashboard/ReportsSection";
import Footer from "@/components/landingPage/Footer";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); 
  }

  return (
    <div className="p-4">
      {/* Navbar Section */}
      <Navbar/>

      {/* Budget Section */}
      <BudgetSection/>

      {/* Expense Section */}
      <ExpenseSection/>

      {/* Reports Section */}
      <ReportsSection/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
