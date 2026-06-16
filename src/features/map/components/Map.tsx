"use client";

import { useEffect } from "react";
import {
  MapContainer,
  useMap,
  Marker,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import SafeReturnRouteLayer from "./layers/SafeReturnRouteLayer";
import DeliveryBoxesLayer from "./layers/DeliveryBoxesLayer";
import EmergencyBellLayer from "./layers/EmergencyBellLayer";
import SafeStoresLayer from "./layers/SafeStoresLayer";
import SmartStreetLightsLayer from "./layers/SmartStreetLightsLayer";
import CctvLayer from "./layers/CctvLayer";
import { useLayerStore } from "@/store/useLayerStore";
import { useMapStore } from "@/store/useMapStore";

const selectedMarkerIcon = L.icon({
  iconUrl: "/icon-location.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function MapController() {
  const map = useMap();
  const setFlyTo = useMapStore((s) => s.setFlyTo);
  const setFitBounds = useMapStore((s) => s.setFitBounds);
  const setZoomIn = useMapStore((s) => s.setZoomIn);
  const setZoomOut = useMapStore((s) => s.setZoomOut);

  useEffect(() => {
    setFlyTo((lat, lng) => { map.flyTo([lat, lng], 16, { duration: 1 }); });
    setFitBounds((bounds) => { map.fitBounds(bounds, { padding: [30, 30], animate: true }); });
    setZoomIn(() => { map.zoomIn(); });
    setZoomOut(() => { map.zoomOut(); });
  }, [map, setFlyTo, setFitBounds, setZoomIn, setZoomOut]);

  return null;
}

function SelectedPlaceLayer() {
  const selectedPlace = useMapStore((s) => s.selectedPlace);
  if (!selectedPlace) return null;

  return (
    <>
      <Marker
        position={[selectedPlace.lat, selectedPlace.lng]}
        icon={selectedMarkerIcon}
      />
      {selectedPlace.geojson && (
        <GeoJSON
          key={`${selectedPlace.lat}-${selectedPlace.lng}`}
          data={selectedPlace.geojson}
          style={{
            color: "#e11d48",
            weight: 2.5,
            opacity: 0.9,
            fillColor: "#e11d48",
            fillOpacity: 0.08,
          }}
        />
      )}
    </>
  );
}

export default function Map() {
  const visibleLayers = useLayerStore((state) => state.visibleLayers);

  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={14}
      maxZoom={20}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <MapController />
      <SelectedPlaceLayer />
      <VectorTileLayer />
      <WmsLayer />
      {visibleLayers.includes("safe-return-routes") && <SafeReturnRouteLayer />}
      {visibleLayers.includes("delivery-boxes") && <DeliveryBoxesLayer />}
      {visibleLayers.includes("emergency-bells") && <EmergencyBellLayer />}
      {visibleLayers.includes("safe-stores") && <SafeStoresLayer />}
      {visibleLayers.includes("smart-street-lights") && (
        <SmartStreetLightsLayer />
      )}
      {visibleLayers.includes("cctv") && <CctvLayer />}
    </MapContainer>
  );
}
