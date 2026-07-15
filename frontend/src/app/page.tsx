import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
    const { userId } = await auth();

    if (userId) {
      redirect("/pages/dashboard");
    } else {
      redirect("/pages/login")
    }
}