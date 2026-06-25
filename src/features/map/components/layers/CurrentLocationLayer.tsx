"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useMapStore } from "@/store/useMapStore";

const icon = L.divIcon({
  html: `<div class="current-location-dot"><div class="current-location-pulse"></div></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function CurrentLocationLayer() {
  const currentLocation = useMapStore((s) => s.currentLocation);
  if (!currentLocation) return null;
  return <Marker position={[currentLocation.lat, currentLocation.lng]} icon={icon} />;
}
