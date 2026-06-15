import L from "leaflet";

export function createMarkerIcon(
  iconUrl: string,
  markerClass: string,
  offsetY = 0,
  anchorShift: [number, number] = [0, 0],
) {
  const mt = offsetY !== 0 ? `margin-top:${offsetY}px;` : "";
  return L.divIcon({
    html: `<div class="map-marker ${markerClass}"><img src="${iconUrl}" style="width:30px;height:30px;display:block;object-fit:contain;filter:drop-shadow(0 0 0.6px rgba(0,0,0,0.9)) drop-shadow(0 0 0.6px rgba(0,0,0,0.9));${mt}" /></div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20 + anchorShift[0], 20 + anchorShift[1]],
    popupAnchor: [0, -22],
  });
}

