import { NextResponse } from "next/server";

const BACKEND_URL =
  `${process.env.BACKEND_URL ?? "http://localhost:3000"}/upload`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const authorization = req.headers.get("Authorization");
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: authorization ?? "",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to upload file",
      },
      {
        status: 500,
      },
    );
  }
}