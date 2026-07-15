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
      signUpUrl="/pages/signup"
      signInUrl="/pages/login"
      afterSignOutUrl="/pages/login"
      signInForceRedirectUrl="/pages/dashboard"
      signUpForceRedirectUrl="/pages/dashboard"
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