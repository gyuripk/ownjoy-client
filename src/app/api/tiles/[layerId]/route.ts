import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ layerId: string }> },
) {
  const { layerId } = await params;
  const safemapKey = process.env.SAFEMAP_KEY;

  const upstream = new URL(`https://www.safemap.go.kr/openapi2/${layerId}`);
  upstream.searchParams.set("serviceKey", safemapKey!);

  req.nextUrl.searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });

  const response = await fetch(upstream.toString());
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/png",
      "Cache-Control": "public, max-age=2592000",
    },
  });
}
