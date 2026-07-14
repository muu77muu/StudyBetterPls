import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${BACKEND}/documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    console.error("Backend returned:", response.status, text);

    return new NextResponse(text, {
      status: response.status,
    });
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ??
        "application/octet-stream",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ?? "",
    },
  });
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }>}
) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${BACKEND}/documents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return new NextResponse(null, {
    status: response.status,
  });
}