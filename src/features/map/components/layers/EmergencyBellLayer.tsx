"use client";
import "./cluster-styles.css";
import L from "leaflet";
import { getBbox } from "../../utils/mapUtils";
import { createMarkerIcon } from "./markerIcon";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslations } from "next-intl";
import MarkerPopup from "../MarkerPopup";
import { usePopupOpen } from "../../hooks/usePopupOpen";

interface BellFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    source_id: string;
    install_place_type: string;
    install_location: string;
    road_address: string;
    link_method: string;
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

type TranslateFn = (key: string) => string;

function formatLinkMethod(code: string, t: TranslateFn) {
  const map: Record<string, string> = {
    "미연계": t("linkMethodNone"),
    "단방향": t("linkMethodOneWay"),
    "양방향": t("linkMethodTwoWay"),
  };
  return map[code] ?? code;
}

export default function EmergencyBellLayer() {
  const map = useMap();
  const t = useTranslations("popup");
  const popupOpen = usePopupOpen();
  const [bells, setBells] = useState<BellCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchBells(getBbox(map)).then(setBells);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setBells(null);
      fetchBells(getBbox(map)).then(setBells);
    },
    zoomend: () => {
      if (popupOpen.current) return;
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
      {bells.features.map((feature) => (
        <Marker
          key={feature.properties.source_id}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={emergencyBellIcon}
        >
          <MarkerPopup
            title={feature.properties.install_location}
            subtitle={feature.properties.install_place_type}
            details={[
              { label: t("address"), value: feature.properties.road_address },
              { label: t("linkMethod"), value: formatLinkMethod(feature.properties.link_method, t) },
              { label: t("policeLinked"), value: feature.properties.police_linked },
              { label: t("securityLinked"), value: feature.properties.security_linked },
              { label: t("officeLinked"), value: feature.properties.office_linked },
              { label: t("working"), value: feature.properties.is_working },
            ]}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
