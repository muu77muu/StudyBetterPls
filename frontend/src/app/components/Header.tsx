"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import "@/app/styles/header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link
          href="/pages/dashboard"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          StudyBetter
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link
            href="/pages/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            href="/pages/documents"
            onClick={() => setMenuOpen(false)}
          >
            Documents
          </Link>

          <Link
            href="/pages/upload"
            onClick={() => setMenuOpen(false)}
          >
            Upload
          </Link>

          <Link
            href="/pages/settings"
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>

          <div className="mobile-only">
            <UserButton />
          </div>
        </nav>

        <div className="desktop-only">
          <UserButton />
        </div>
      </div>
    </header>
  );
}