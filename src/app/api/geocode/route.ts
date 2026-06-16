type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
};

async function nominatimSearch(keyword: string): Promise<object[]> {
  const params = new URLSearchParams({
    q: keyword,
    format: "json",
    countrycodes: "kr",
    limit: "5",
    "accept-language": "en",
    addressdetails: "1",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "User-Agent": "Ownjoy/1.0" } }
  );
  if (!res.ok) return [];
  const data: NominatimResult[] = await res.json();
  return data.map((r) => ({
    roadAddr: r.display_name,
    jibunAddr: r.display_name,
    engAddr: r.display_name,
    bdNm: r.address?.amenity ?? r.address?.building ?? "",
    admCd: "",
    rnMgtSn: "",
    udrtYn: "0",
    buldMnnm: 0,
    buldSlno: 0,
    _lat: r.lat,
    _lng: r.lon,
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get("q")?.trim();
  const lang = url.searchParams.get("lang") ?? "ko";
  if (!keyword) return Response.json([]);

  const isEn = lang === "en";

  if (isEn) {
    return Response.json(await nominatimSearch(keyword));
  }

  // Korean
  const confmKey = process.env.JUSO_KO_API_KEY;
  if (!confmKey) {
    console.error("JUSO_KO_API_KEY is not set");
    return Response.json([]);
  }
  const params = new URLSearchParams({
    currentPage: "1",
    countPerPage: "5",
    keyword,
    confmKey,
    resultType: "json",
    hstryYn: "N",
  });
  const res = await fetch(
    `https://business.juso.go.kr/addrlink/addrLinkApi.do?${params}`
  );
  const raw = await res.json();
  if (raw?.results?.common?.errorCode !== "0") {
    console.error("Juso API error:", raw?.results?.common);
    return Response.json([]);
  }
  return Response.json(raw.results.juso ?? []);
}
