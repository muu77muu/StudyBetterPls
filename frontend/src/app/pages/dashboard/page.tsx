import Link from "next/link";
import "@/app/styles/dashboard.css";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";


const pages = [
  { 
    title: "Documents",
    icon: "📄",
    href: "/pages/documents",
    description:
      "Browse, search and manage your uploaded materials.",
  },
  {
    title: "Upload",
    icon: "📤",
    href: "/pages/upload",
    description:
      "Upload your notes, PDFs, and media resources.",
  },
  {
    title: "Settings",
    icon: "⚙️",
    href: "/pages/settings",
    description:
      "Manage your preferences properly can anot?",
  },
  {
    title: "Study Progress",
    icon: "📈",
    href: "#",
    description:
      "I track for you, lazy eh",
    disabled: true,
  },
];

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/pages/login");
  }

  return (
    <main className="dashboard">
      <section className="hero">
        <h1>why r u here?</h1>
        eh hello
      </section>

      <section className="quick-actions">
        <h2>faster click</h2>

        <div className="card-grid">
          {pages.map((page) =>
            page.disabled ? (
              <div className="dashboard-card disabled" key={page.title}>
                <span className="icon">{page.icon}</span>

                <h3>{page.title}</h3>

                <p>{page.description}</p>

                <span className="coming-soon">
                  Coming Soon
                </span>
              </div>
            ) : (
              <Link
                key={page.title}
                href={page.href}
                className="dashboard-card"
              >
                <span className="icon">{page.icon}</span>

                <h3>{page.title}</h3>

                <p>{page.description}</p>

                <span className="open-link">
                  Open →
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="activity">
        <h2>Recent Activity</h2>

        <div className="empty-state">
          <p>No recent activity yet.</p>
          <p>Upload your first document to begin studying.</p>
        </div>
      </section>
    </main>
  );
}