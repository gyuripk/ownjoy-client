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

type TranslateFn = (key: string) => string;

function formatLampType(code: string, t: TranslateFn) {
  const normalize = (c: string) => c.trim().padStart(2, "0");
  const lookup = (c: string) => t(`lampType${normalize(c)}`) ?? c;
  return code.split("+").map(lookup).join(" · ");
}

export default function SmartStreetLightsLayer() {
  const map = useMap();
  const t = useTranslations("popup");
  const popupOpen = usePopupOpen();
  const [lights, setLights] = useState<SmartStreetLightCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchLights(getBbox(map)).then(setLights);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setLights(null);
      fetchLights(getBbox(map)).then(setLights);
    },
    zoomend: () => {
      if (popupOpen.current) return;
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
      {lights.features.map((feature) => (
        <Marker
          key={feature.properties.id}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={streetLightIcon}
        >
          <MarkerPopup
            title={feature.properties.road_address}
            details={[
              { label: t("lampType"), value: formatLampType(feature.properties.lamp_type, t) },
              { label: t("alwaysOn"), value: feature.properties.always_on },
              { label: t("hasCctv"), value: feature.properties.has_cctv },
              { label: t("hasWifi"), value: feature.properties.has_wifi },
              { label: t("hasEmergencyCall"), value: feature.properties.has_emergency_call },
            ]}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
