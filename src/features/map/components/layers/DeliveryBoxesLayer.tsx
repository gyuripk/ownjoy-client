"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./cluster-styles.css";
import { createMarkerIcon } from "./markerIcon";
import { getBbox } from "../../utils/mapUtils";

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

export default function DeliveryBoxesLayer() {
  const map = useMap();
  const [boxes, setBoxes] = useState<DeliveryBoxCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 14) return;
    fetchBoxes(getBbox(map)).then(setBoxes);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 14) return void setBoxes(null);
      fetchBoxes(getBbox(map)).then(setBoxes);
    },
    zoomend: () => {
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
      {boxes.features.map((feature, index) => (
        <Marker
          key={index}
          position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          icon={deliveryBoxIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
