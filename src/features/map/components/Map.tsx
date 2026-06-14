"use client";

// import modules
import { MapContainer } from "react-leaflet"; // useMap: hooks
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import { MapFilter } from "./MapFilter";
import SafeReturnRouteLayer from "./layers/SafetyReturnRouterLayer";
import DeliveryBoxesLayer from "./layers/DeliveryBoxesLayer";
import EmergencyBellLayer from "./layers/EmergencyBellLayer";
import SafeStoresLayer from "./layers/SafeStoresLayer";
import SmartStreetLightsLayer from "./layers/SmartStreetLightsLayer";
import CctvLayer from "./layers/CctvLayer";

export default function Map() {
  return (
    <MapContainer
      center={[37.5665, 126.978]} // lattitude , longitude
      zoom={14}
      maxZoom={18}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Base map */}
      <VectorTileLayer />
      {/* Heat map */}
      <WmsLayer />
      {/* Infra locations */}
      <SafeReturnRouteLayer />
      <DeliveryBoxesLayer />
      <EmergencyBellLayer />
      <SafeStoresLayer />
      <SmartStreetLightsLayer />
      <CctvLayer />
      {/* Filter */}
      <MapFilter />
    </MapContainer>
  );
}
