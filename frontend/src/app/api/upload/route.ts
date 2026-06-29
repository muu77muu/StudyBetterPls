import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "No file" },
      { status: 400 }
    );
  }

  const response = await fetch(
    "http://localhost:8000/api/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}