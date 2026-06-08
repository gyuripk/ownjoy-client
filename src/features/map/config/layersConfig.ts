const safemapKey = process.env.NEXT_PUBLIC_SAFEMAP_API_KEY;
const seoulKey = process.env.NEXT_PUBLIC_SEOUL_API_KEY;

export const WMS_LAYERS = [
  {
    // 비상벨
    id: "IF_0032_WMS",
    name: "비상벨",
    url: `https://www.safemap.go.kr/openapi2/IF_0032_WMS?serviceKey=${safemapKey}`,
    layers: "A2SM_CMMNPOI_EMGBELL",
    styles: "A2SM_CMMNPOI_EMGBELL",
    format: "image/png",
    transparent: true,
  },
  {
    //여성밤길치안안전(성폭력)
    id: "IF_0079_WMS",
    name: "여성밤길치안안전(성폭력)",
    url: `https://www.safemap.go.kr/openapi2/IF_0079_WMS?serviceKey=${safemapKey}`,
    layers: "A2SM_CRMNLHSPOT_F1_RAPE",
    styles: "",
    format: "image/png",
    transparent: true,
  },
  {
    // 범죄주의구간(성폭력)
    id: "IF_0085_WMS",
    name: "범죄주의구간(성폭력)",
    url: `https://www.safemap.go.kr/openapi2/IF_0085_WMS?serviceKey=${safemapKey}`,
    layers: "A2SM_CRMNLHSPOT_TOT",
    styles: "A2SM_CrmnlHspot_Tot_Rape",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  },
  {
    //범죄예방환경설계
    id: "IF_0023_WMS",
    name: "범죄예방환경설계",
    url: `https://www.safemap.go.kr/openapi2/IF_0023_WMS?serviceKey=${safemapKey}`,
    layers: "A2SM_CPTED_G",
    styles: "A2SM_CPTED_G",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  },
  {
    //치안사고통계(성폭력)
    id: "IF_0070_WMS",
    name: "치안사고통계(성폭력)",
    url: `https://www.safemap.go.kr/openapi2/IF_0070_WMS?serviceKey=${safemapKey}`,
    layers: "A2SM_CRMNLSTATS",
    styles: "A2SM_CrmnlStats_Rape",
    format: "image/png",
    transparent: true,
    legendUrl: `https://www.safemap.go.kr/openapi2/lgdInfo?serviceKey=${safemapKey}&intId=IF_0070`,
  },
];
