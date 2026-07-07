"use client";

import { UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <header className="header">
      <UserButton />
    </header>
  );
}