import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/app/components/Header";
import "./globals.css";

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
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}