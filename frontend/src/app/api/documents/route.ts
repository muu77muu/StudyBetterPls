import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL}/documents`;

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(BACKEND_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}