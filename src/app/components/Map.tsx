"use client";

// import modules
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet"; // useMap: hooks
import L from "leaflet";
import { useEffect } from "react";

export default function Map() {
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: "/map-pin.svg",

      iconSize: window.innerWidth < 768 ? [36, 36] : [32, 32],
      iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
      <TileLayer url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png" />
      <Marker position={[37.5665, 126.978]}>
        <Popup>
          A popup. <br /> It's Seoul!
        </Popup>
      </Marker>
    </MapContainer>
  );
}
