"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";
import { createMarkerIcon } from "./markerIcon";
import { getBbox } from "../../utils/mapUtils";

interface CctvFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
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

const cctvIcon = createMarkerIcon("/icon-cctv.png", "cctv-marker", -10, [-12, -12]);

async function fetchCctvs(bbox: string): Promise<CctvCollection> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/cctv?bbox=${bbox}`);
  return res.json();
}

export default function CctvLayer() {
  const map = useMap();
  const [cctvs, setCctvs] = useState<CctvCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchCctvs(getBbox(map)).then(setCctvs);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 14) return void setCctvs(null);
      fetchCctvs(getBbox(map)).then(setCctvs);
    },
    zoomend: () => {
      if (map.getZoom() < 14) return void setCctvs(null);
      fetchCctvs(getBbox(map)).then(setCctvs);
    },
  });

  if (!cctvs) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={150}
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
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={cctvIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
