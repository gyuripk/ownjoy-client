async function nominatimGeocode(q: string): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({
    q,
    format: "json",
    countrycodes: "kr",
    limit: "1",
    "accept-language": "ko",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "User-Agent": "Ownjoy/1.0" } }
  );
  const data = await res.json();
  if (data?.[0]?.lat && data?.[0]?.lon) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export async function GET(req: Request) {
  const confmKey = process.env.JUSO_KO_API_KEY;
  if (!confmKey) return Response.json({ error: "JUSO_KO_API_KEY not set" }, { status: 500 });

  const sp = new URL(req.url).searchParams;

  // Try Juso coordinate API first (most accurate — building entrance coordinate)
  const params = new URLSearchParams({
    admCd: sp.get("admCd") ?? "",
    rnMgtSn: sp.get("rnMgtSn") ?? "",
    udrtYn: sp.get("udrtYn") ?? "0",
    buldMnnm: sp.get("buldMnnm") ?? "0",
    buldSlno: sp.get("buldSlno") ?? "0",
    confmKey,
    resultType: "json",
  });
  let juso = null;
  try {
    const jusoRes = await fetch(
      `https://business.juso.go.kr/addrlink/addrCoordApi.do?${params}`
    );
    const raw = await jusoRes.json();
    juso = raw?.results?.juso?.[0];
  } catch {
    // Blocked from abroad or non-JSON response — fall through to Nominatim
  }
  if (juso?.entX && juso?.entY) {
    return Response.json({ lat: parseFloat(juso.entY), lng: parseFloat(juso.entX) });
  }


  // Fallback: Nominatim with progressively simplified address strings.
  // Juso's roadAddr format: "서울특별시 노원구 동일로215길 2 (상계동)"
  // Nominatim fails on building numbers and parentheticals, so we strip them.
  const roadAddr = sp.get("q");
  if (roadAddr) {
    const withoutParens = roadAddr.replace(/\s*\([^)]*\)/g, "").trim();
    const withoutBuilding = withoutParens.replace(/\s+\d+(-\d+)?$/, "").trim();

    const result =
      (await nominatimGeocode(withoutParens)) ??
      (await nominatimGeocode(withoutBuilding));

    if (result) return Response.json(result);
  }

  return Response.json({ error: "좌표를 찾을 수 없습니다" }, { status: 404 });
}
