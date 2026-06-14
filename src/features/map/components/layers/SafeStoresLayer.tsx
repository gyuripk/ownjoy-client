"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";

interface SafeStoreFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: number;
    name: string;
    road_address: string;
    phone: string;
    police_station: string;
    is_operating: boolean;
  };
}

interface SafeStoreCollection {
  type: "FeatureCollection";
  features: SafeStoreFeature[];
}

const safeStoreIcon = L.icon({
  iconUrl: "/icon-safe-store.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function SafeStoresLayer() {
  const map = useMap();
  const [stores, setStores] = useState<SafeStoreCollection | null>(null);

  function fetchStores() {
    if (map.getZoom() < 14) {
      setStores(null);
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/safe-stores?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setStores(data));
  }

  useEffect(() => {
    fetchStores();
  }, []);

  useMapEvents({ moveend: fetchStores, zoomend: fetchStores });

  if (!stores) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={100}
      disableClusteringAtZoom={17}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster store-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {stores.features.map((feature, index) => (
        <Marker
          key={index}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={safeStoreIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
