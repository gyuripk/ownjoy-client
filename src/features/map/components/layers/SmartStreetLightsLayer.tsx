"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";
import { createMarkerIcon } from "./markerIcon";
import { getBbox } from "../../utils/mapUtils";

interface SmartStreetLightFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
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

const streetLightIcon = createMarkerIcon("/icon-street-light.png", "light-marker");

async function fetchLights(bbox: string): Promise<SmartStreetLightCollection> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/smart-street-lights?bbox=${bbox}`);
  return res.json();
}

export default function SmartStreetLightsLayer() {
  const map = useMap();
  const [lights, setLights] = useState<SmartStreetLightCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchLights(getBbox(map)).then(setLights);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 14) return void setLights(null);
      fetchLights(getBbox(map)).then(setLights);
    },
    zoomend: () => {
      if (map.getZoom() < 14) return void setLights(null);
      fetchLights(getBbox(map)).then(setLights);
    },
  });

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
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={streetLightIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
