export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  console.log("HOME PAGE EXECUTED");

  const { userId } = await auth();

  console.log({ userId });

  if (userId) {
    redirect("/pages/dashboard");
  }

  redirect("/sign-in");
}