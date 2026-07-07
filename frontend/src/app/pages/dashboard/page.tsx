import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import "@/app/styles/dashboard.css";
import Link from "next/link";

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

        <div className="dashboard-links">
          <Link href="/pages/documents">📄 Documents</Link>
          <Link href="/pages/upload">📤 Upload</Link>
          <Link href="/pages/settings">⚙️ Settings</Link>
        </div>
      </div>
    </main>
  );
}