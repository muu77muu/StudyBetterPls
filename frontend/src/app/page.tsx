import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main>
      <Show when="signed-out">
        <Link href="/pages/login">Login</Link>
      </Show>

      <Show when="signed-in">
        <UserButton />
        <Link href="/pages/dashboard">Dashboard</Link>
      </Show>
    </main>
  );
}