"use client";
import "./cluster-styles.css";
import L from "leaflet";
import { getBbox } from "../../utils/mapUtils";
import { createMarkerIcon } from "./markerIcon";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface BellFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    source_id: string;
    install_place_type: string;
    install_location: string;
    road_address: string;
    police_linked: boolean;
    security_linked: boolean;
    office_linked: boolean;
    is_working: boolean;
  };
}

interface BellCollection {
  type: "FeatureCollection";
  features: BellFeature[];
}

const emergencyBellIcon = createMarkerIcon("/icon-emergency-bell.png", "bell-marker", -8, [12, -12]);

async function fetchBells(bbox: string): Promise<BellCollection> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/emergency-bells?bbox=${bbox}`,
  );
  return res.json();
}

export default function EmergencyBellLayer() {
  const map = useMap();
  const [bells, setBells] = useState<BellCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchBells(getBbox(map)).then(setBells);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 14) return void setBells(null);
      fetchBells(getBbox(map)).then(setBells);
    },
    zoomend: () => {
      if (map.getZoom() < 14) return void setBells(null);
      fetchBells(getBbox(map)).then(setBells);
    },
  });

  if (!bells) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={150}
      disableClusteringAtZoom={17}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster bell-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {bells.features.map((feature, index) => (
        <Marker
          key={index}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={emergencyBellIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
