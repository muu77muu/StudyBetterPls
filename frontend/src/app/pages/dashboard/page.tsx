import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import "@/app/styles/dashboard.css";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="dashboard">
      <div className="dashboard-card">
        <h1>Dashboard</h1>
        <p>Welcome to StudyBetter!</p>
      </div>
    </main>
  );
}