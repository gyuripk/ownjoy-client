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

interface DeliveryBoxFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: number;
    name: string;
    road_address: string;
    weekday_open: string;
    weekday_close: string;
    saturday_open: string;
    saturday_close: string;
    holiday_open: string;
    holiday_close: string;
    late_fee: number;
    free_hours: number;
    support_phone: string;
  };
}

interface DeliveryBoxCollection {
  type: "FeatureCollection";
  features: DeliveryBoxFeature[];
}

const deliveryBoxIcon = createMarkerIcon("/icon-delivery-box.png", "delivery-marker", 0, [12, 12]);

async function fetchBoxes(bbox: string): Promise<DeliveryBoxCollection> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/delivery-boxes?bbox=${bbox}`);
  return res.json();
}

function formatTime(time: string) {
  return time?.slice(0, 5) ?? "-";
}

export default function DeliveryBoxesLayer() {
  const map = useMap();
  const t = useTranslations("popup");
  const popupOpen = usePopupOpen();
  const [boxes, setBoxes] = useState<DeliveryBoxCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchBoxes(getBbox(map)).then(setBoxes);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setBoxes(null);
      fetchBoxes(getBbox(map)).then(setBoxes);
    },
    zoomend: () => {
      if (popupOpen.current) return;
      if (map.getZoom() < 14) return void setBoxes(null);
      fetchBoxes(getBbox(map)).then(setBoxes);
    },
  });

  if (!boxes) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={80}
      disableClusteringAtZoom={17}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster delivery-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {boxes.features.map((feature) => (
        <Marker
          key={feature.properties.id}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={deliveryBoxIcon}
        >
          <MarkerPopup
            title={feature.properties.name}
            details={[
              { label: t("address"), value: feature.properties.road_address },
              { label: t("phone"), value: feature.properties.support_phone },
              { label: t("weekdayHours"), value: `${formatTime(feature.properties.weekday_open)} – ${formatTime(feature.properties.weekday_close)}` },
              { label: t("saturdayHours"), value: `${formatTime(feature.properties.saturday_open)} – ${formatTime(feature.properties.saturday_close)}` },
              { label: t("holidayHours"), value: `${formatTime(feature.properties.holiday_open)} – ${formatTime(feature.properties.holiday_close)}` },
              { label: t("freeHours"), value: String(feature.properties.free_hours) },
              { label: t("lateFee"), value: String(feature.properties.late_fee) },
            ]}
          />
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
