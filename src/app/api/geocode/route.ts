type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
};

type KakaoAddressDocument = {
  address_name: string;
  x: string;
  y: string;
  address: { address_name: string } | null;
  road_address: { address_name: string; building_name: string } | null;
};

type KakaoKeywordDocument = {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
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

async function kakaoSearch(keyword: string): Promise<object[]> {
  const apiKey = process.env.KAKAO_API_KEY;
  if (!apiKey) return [];

  const headers = { Authorization: `KakaoAK ${apiKey}` };
  const params = new URLSearchParams({ query: keyword, size: "5" });

  // Try address search first
  const addrRes = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?${params}`,
    { headers }
  );
  if (addrRes.ok) {
    const addrData = await addrRes.json();
    const docs: KakaoAddressDocument[] = addrData.documents ?? [];
    if (docs.length > 0) {
      return docs.map((d) => ({
        roadAddr: d.road_address?.address_name || d.address_name,
        jibunAddr: d.address?.address_name || d.address_name,
        engAddr: d.road_address?.address_name || d.address_name,
        bdNm: d.road_address?.building_name || "",
        admCd: "",
        rnMgtSn: "",
        udrtYn: "0",
        buldMnnm: 0,
        buldSlno: 0,
        _lat: d.y,
        _lng: d.x,
      }));
    }
  }

  // Fallback: keyword search (place names, subway stations, etc.)
  const kwRes = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?${params}`,
    { headers }
  );
  if (!kwRes.ok) return [];
  const kwData = await kwRes.json();
  return (kwData.documents ?? []).map((d: KakaoKeywordDocument) => ({
    roadAddr: d.road_address_name || d.address_name,
    jibunAddr: d.address_name,
    engAddr: d.road_address_name,
    bdNm: d.place_name,
    admCd: "",
    rnMgtSn: "",
    udrtYn: "0",
    buldMnnm: 0,
    buldSlno: 0,
    _lat: d.y,
    _lng: d.x,
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get("q")?.trim();
  const lang = url.searchParams.get("lang") ?? "ko";
  if (!keyword) return Response.json([]);

  if (lang === "en") {
    return Response.json(await nominatimSearch(keyword));
  }

  return Response.json(await kakaoSearch(keyword));
}
