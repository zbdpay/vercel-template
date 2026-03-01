import { zbdFetch } from "@/lib/zbd";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  try {
    const response = await zbdFetch(url);
    const data = await response.json();
    return Response.json({ data, status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
