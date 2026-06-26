"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";
import { createMarkerIcon } from "./markerIcon";
import { getBbox } from "../../utils/mapUtils";
import { useTranslations } from "next-intl";
import MarkerPopup from "../MarkerPopup";
import { usePopupOpen } from "../../hooks/usePopupOpen";

interface SafeStoreFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
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

const safeStoreIcon = createMarkerIcon("/icon-safe-store.png", "store-marker", -6, [-12, 12]);

async function fetchStores(bbox: string): Promise<SafeStoreCollection> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/safe-stores?bbox=${bbox}`);
  return res.json();
}

export default function SafeStoresLayer() {
  const map = useMap();
  const t = useTranslations("popup");
  const popupOpen = usePopupOpen();
  const [stores, setStores] = useState<SafeStoreCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchStores(getBbox(map)).then(setStores);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setStores(null);
      fetchStores(getBbox(map)).then(setStores);
    },
    zoomend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setStores(null);
      fetchStores(getBbox(map)).then(setStores);
    },
  });

  if (!stores) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={80}
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
      {stores.features.map((feature) => (
        <Marker
          key={feature.properties.id}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={safeStoreIcon}
        >
          <MarkerPopup
            title={feature.properties.name}
            details={[
              { label: t("address"), value: feature.properties.road_address },
              { label: t("phone"), value: feature.properties.phone },
              { label: t("station"), value: feature.properties.police_station },
              { label: t("operating"), value: feature.properties.is_operating },
            ]}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
