"use client";

// import modules
import L from "leaflet";
import { MapContainer, Marker, Popup } from "react-leaflet"; // useMap: hooks
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import MarkerLayer from "./layers/MarkerLayer";
import { MapFilter } from "./MapFilter";

export default function Map() {
  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Base map */}
      <VectorTileLayer />
      <WmsLayer />
      <MarkerLayer />
      <MapFilter />
    </MapContainer>
  );
}
