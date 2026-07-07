"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import "@/app/styles/header.css";

export default function Header() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isSignedIn) return null;

  const handleSignOut = async () => {
    await signOut({
      redirectUrl: "/sign-in",
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/pages/dashboard" className="logo">
          StudyBetter
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/pages/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <Link href="/pages/documents" onClick={() => setMenuOpen(false)}>
            Documents
          </Link>

          <Link href="/pages/upload" onClick={() => setMenuOpen(false)}>
            Upload
          </Link>

          <Link href="/pages/settings" onClick={() => setMenuOpen(false)}>
            Settings
          </Link>

          <button
            className="signout-btn mobile-only"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </nav>

        <button
          className="signout-btn desktop-only"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}