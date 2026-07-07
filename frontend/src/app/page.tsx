import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import "./globals.css";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/pages/dashboard");
  }

  return (
    <main className="landing-page">
      <div className="login-card">
        <h1>StudyBetter</h1>
        <p>Sign in to continue.</p>

        <SignIn />
      </div>
    </main>
  );
}