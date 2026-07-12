import { getToken } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL}/upload`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const authorization = req.headers.get("Authorization");

    console.log("Forwarding upload to:", BACKEND_URL);


    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: authorization ?? "",
      },
    });

    const text = await response.text();

    console.log("Backend status:", response.status);
    console.log("Backend response:", text);

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.error("Upload proxy error:", err);

    return NextResponse.json(
      { error: String(err) },
      { status: 500 },
    );
  }
}