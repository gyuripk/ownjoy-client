"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";

interface SmartStreetLightFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: number;
    lamp_type: string;
    road_address: string;
    always_on: boolean;
    has_cctv: boolean;
    has_wifi: boolean;
    has_emergency_call: boolean;
  };
}

interface SmartStreetLightCollection {
  type: "FeatureCollection";
  features: SmartStreetLightFeature[];
}

const streetLightIcon = L.icon({
  iconUrl: "/icon-street-light.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function SmartStreetLightsLayer() {
  const map = useMap();
  const [lights, setLights] = useState<SmartStreetLightCollection | null>(null);

  function fetchLights() {
    if (map.getZoom() < 14) {
      setLights(null);
      return;
    }

    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(",");

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/smart-street-lights?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setLights(data));
  }

  useEffect(() => {
    fetchLights();
  }, []);

  useMapEvents({ moveend: fetchLights, zoomend: fetchLights });

  if (!lights) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={80}
      disableClusteringAtZoom={17}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster light-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {lights.features.map((feature, index) => (
        <Marker
          key={index}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={streetLightIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
