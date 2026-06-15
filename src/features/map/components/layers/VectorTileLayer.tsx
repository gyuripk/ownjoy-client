import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl";

export default function VectorTileLayer() {
  const map = useMap();

  useEffect(() => {
    // OpenFreeMap Settings
    const gl = L.maplibreGL({
      style: "https://tiles.openfreemap.org/styles/bright",
    }).addTo(map);

    return () => {
      // remove layer when component unmounts
      gl.remove();
    };
  }, [map]);
  return null;
}
