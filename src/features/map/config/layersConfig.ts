export const BASE_LAYERS = [
  {
    id: "IF_0079_WMS",
    name: "여성밤길치안안전(성폭력)",
    layers: "A2SM_CRMNLHSPOT_F1_RAPE",
    styles: "",
    format: "image/png",
    transparent: false,
  },
  {
    id: "IF_0078_WMS",
    name: "여성밤길치안안전(폭력)",
    layers: "A2SM_CRMNLHSPOT_F1_VIOLN",
    styles: "",
    format: "image/png",
    transparent: true,
  },
  {
    id: "IF_0085_WMS",
    name: "범죄주의구간(성폭력)",
    layers: "A2SM_CRMNLHSPOT_TOT",
    styles: "A2SM_CrmnlHspot_Tot_Rape",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  },
  {
    id: "IF_0083_WMS",
    name: "범죄주의구간(폭력)",
    layers: "A2SM_CRMNLHSPOT_TOT",
    styles: "A2SM_CrmnlHspot_Tot_Violn",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  },
  {
    id: "IF_0023_WMS",
    name: "범죄예방환경설계",
    layers: "A2SM_CPTED_G",
    styles: "",
    format: "image/png",
    transparent: true,
    opacity: 0.6,
  },
  {
    id: "IF_0102_WMS",
    name: "보안등",
    layers: "A2SM_CMMNPOI_SECULIGHT",
    styles: "A2SM_CMMNPOI_07",
    format: "image/png",
    transparent: true,
  },
  {
    id: "IF_0032_WMS",
    name: "안전비상벨",
    layers: "A2SM_CMMNPOI_EMGBELL",
    styles: "A2SM_CMMNPOI_EMGBELL",
    format: "image/png",
    transparent: false,
  },
  {
    id: "IF_0036_WMS",
    name: "치안시설",
    layers: "A2SM_CMMNPOI2",
    styles: "A2SM_CmmnPoi2",
    format: "image/png",
  },
];

export const WMS_LAYERS = BASE_LAYERS.map((layer) => ({
  ...layer,
  url: `/api/tiles/${layer.id}`,
}));

export const LAYER_CATEGORIES = [
  {
    id: "crime-zone",
    name: "범죄주의구간",
    icon: "/icon-crime-zone.png",
    multiSelect: false,
    layers: [
      { id: "IF_0085_WMS", name: "성폭력", type: "wms" },
      { id: "IF_0083_WMS", name: "폭력", type: "wms" },
    ],
  },
  {
    id: "crime-night",
    name: "여성밤길치안안전",
    icon: "/icon-womens-night-safety.png",
    multiSelect: false,
    layers: [
      { id: "IF_0079_WMS", name: "성폭력", type: "wms" },
      { id: "IF_0078_WMS", name: "폭력", type: "wms" },
    ],
  },
  {
    id: "security-infra",
    name: "치안시설",
    icon: "/icon-security-infra.png",
    multiSelect: true,
    layers: [
      { id: "cctv", name: "CCTV", type: "point", icon: "/icon-cctv.png" },
      {
        id: "smart-street-lights",
        name: "스마트 가로등",
        type: "point",
        icon: "/icon-street-light.png",
      },
      {
        id: "emergency-bells",
        name: "비상벨",
        type: "point",
        icon: "/icon-emergency-bell.png",
      },
      {
        id: "delivery-boxes",
        name: "안심택배함",
        type: "point",
        icon: "/icon-delivery-box.png",
      },
      {
        id: "IF_0102_WMS",
        name: "보안등",
        type: "wms",
        icon: "/icon-security-light.png",
      },
    ],
  },
  {
    id: "security-service",
    name: "치안서비스",
    icon: "/icon-security-service.png",
    multiSelect: true,
    layers: [
      {
        id: "safe-return-routes",
        name: "안심귀갓길",
        type: "point",
        icon: "/icon-safe-return-route.png",
      },
      {
        id: "safe-stores",
        name: "여성안심지킴이집",
        type: "point",
        icon: "/icon-safe-store.png",
      },
      {
        id: "IF_0023_WMS",
        name: "CPTED 구역",
        type: "wms",
        icon: "/icon-cpted-zone.png",
      },
    ],
  },
];
