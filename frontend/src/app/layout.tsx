import Header from "@/app/components/Header";
import "./globals.css";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "StudyBetter",
  description: "StudyBetter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/pages/login"
      signUpUrl="/pages/signup"
      afterSignOutUrl="/pages/login"
    >
      <html lang="en">
        <body>
          <div className="app-layout">
            <Header />
            <main className="page-content">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}