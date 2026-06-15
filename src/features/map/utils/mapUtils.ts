import { useMap } from "react-leaflet";

export function getBbox(map: ReturnType<typeof useMap>) {
  const b = map.getBounds();
  return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].join(",");
}
