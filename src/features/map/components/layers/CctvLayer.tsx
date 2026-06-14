"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";

interface CctvFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    source_id: string;
    road_address: string;
    lot_address: string;
    purpose: string;
    camera_count: number;
  };
}

interface CctvCollection {
  type: "FeatureCollection";
  features: CctvFeature[];
}

const cctvIcon = L.icon({
  iconUrl: "/icon-cctv.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function CctvLayer() {
  const map = useMap();
  const [cctvs, setCctvs] = useState<CctvCollection | null>(null);

  function fetchCctvs() {
    if (map.getZoom() < 15) {
      setCctvs(null);
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/cctv?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setCctvs(data));
  }

  useEffect(() => {
    fetchCctvs();
  }, []);

  useMapEvents({ moveend: fetchCctvs, zoomend: fetchCctvs });

  if (!cctvs) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={80}
      disableClusteringAtZoom={17}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster cctv-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {cctvs.features.map((feature, index) => (
        <Marker
          key={index}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={cctvIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
