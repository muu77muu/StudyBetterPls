import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/documents`, {
    method: "GET",
  });

  const data = await response.json();
  return NextResponse.json(data);
} 