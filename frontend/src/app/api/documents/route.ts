import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("http://localhost:8000/api/documents", {
    method: "GET",
  });

  const data = await response.json();
  return NextResponse.json(data);
} 