export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const lang = searchParams.get("lang") ?? "ko";
  if (!lat || !lng) return Response.json({ error: "lat and lng required" }, { status: 400 });

  if (lang === "en") {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      { headers: { "User-Agent": "Ownjoy/1.0" } },
    );
    const data = await res.json();
    const addr = data?.address;
    if (!addr) return Response.json({ error: "No address found" }, { status: 404 });
    const district = addr.city_district ?? addr.suburb ?? addr.county ?? "";
    const city = addr.city ?? addr.state ?? "";
    return Response.json({ display: `${district}, ${city}`.replace(/^, |, $/, "") });
  }

  const key = process.env.KAKAO_API_KEY;
  if (!key) return Response.json({ error: "KAKAO_API_KEY not set" }, { status: 500 });

  const params = new URLSearchParams({ x: lng, y: lat, input_coord: "WGS84" });
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?${params}`,
    { headers: { Authorization: `KakaoAK ${key}` } },
  );
  const data = await res.json();
  const doc = data?.documents?.[0];
  if (!doc) return Response.json({ error: "No address found" }, { status: 404 });

  const addr = doc.road_address ?? doc.address;
  return Response.json({ display: `${addr.region_2depth_name} ${addr.region_3depth_name}` });
}
