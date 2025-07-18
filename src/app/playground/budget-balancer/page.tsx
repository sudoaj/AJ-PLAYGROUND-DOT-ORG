import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BudgetBalancer from "@/components/BudgetBalancer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Budget Balancer | AJ Playground",
  description: "Balance your budget, one paycheck at a time. A comprehensive budget management tool.",
  keywords: ["budget", "finance", "money management", "paycheck", "savings", "bills"],
};

export default async function BudgetBalancerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/playground/budget-balancer");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[hsl(240,10%,4%)]">
      <BudgetBalancer />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(0, 0%, 100%)',
            color: 'hsl(0, 0%, 4%)',
            border: '1px solid hsl(0, 0%, 89%)',
          },
          className: 'dark:!bg-[hsl(240,4%,16%)] dark:!text-[hsl(0,0%,98%)] dark:!border-[hsl(240,4%,16%)]',
        }}
      />
    </div>
  );
}
