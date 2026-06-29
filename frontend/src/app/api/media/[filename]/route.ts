import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../../../lib/r2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const key = `media/${filename}`;
  console.log("Fetching from R2:", key);

  try {
    const result = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );

    if (!result.Body) {
      console.error("No Body returned from R2");
      return new Response("Not found", { status: 404 });
    }

    return new Response(result.Body.transformToWebStream(), {
      headers: {
        "Content-Type":
          result.ContentType ?? "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("R2 ERROR:", err);
    return Response.json(
      {
        error: err instanceof Error ? err.message : String(err),
        key,
      },
      { status: 500 }
    );
  }
}