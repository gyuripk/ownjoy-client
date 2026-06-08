import { WMSTileLayer } from "react-leaflet";

const safemapKey = process.env.NEXT_PUBLIC_SAFEMAP_API_KEY;

export default function WmsLayer() {
  return (
    // 여성밤길치안안전 - 성폭력
    <WMSTileLayer
      url={`https://www.safemap.go.kr/openapi2/IF_0079_WMS?serviceKey=${safemapKey}`}
      layers="A2SM_CRMNLHSPOT_F1_RAPE"
      styles=""
      format="image/png"
      transparent={true}
    />
  );
}
