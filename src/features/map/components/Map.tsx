"use client";

import { MapContainer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import SafeReturnRouteLayer from "./layers/SafetyReturnRouterLayer";
import DeliveryBoxesLayer from "./layers/DeliveryBoxesLayer";
import EmergencyBellLayer from "./layers/EmergencyBellLayer";
import SafeStoresLayer from "./layers/SafeStoresLayer";
import SmartStreetLightsLayer from "./layers/SmartStreetLightsLayer";
import CctvLayer from "./layers/CctvLayer";
import { useLayerStore } from "@/store/useLayerStore";

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
      {/* zoom controls moved to topright to avoid overlapping the side panel */}
      <ZoomControl position="topright" />
      <VectorTileLayer />
      <WmsLayer />
      {visibleLayers.includes("safe-return-routes") && <SafeReturnRouteLayer />}
      {visibleLayers.includes("delivery-boxes") && <DeliveryBoxesLayer />}
      {visibleLayers.includes("emergency-bells") && <EmergencyBellLayer />}
      {visibleLayers.includes("safe-stores") && <SafeStoresLayer />}
      {visibleLayers.includes("smart-street-lights") && <SmartStreetLightsLayer />}
      {visibleLayers.includes("cctv") && <CctvLayer />}
    </MapContainer>
  );
}
