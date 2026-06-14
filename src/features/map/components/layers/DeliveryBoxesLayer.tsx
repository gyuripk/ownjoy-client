"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "./EmergencyBellLayer.css";

interface DeliveryBoxFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
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

const deliveryBoxIcon = L.icon({
  iconUrl: "/icon-delivery-box.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function DeliveryBoxesLayer() {
  const map = useMap();
  const [boxes, setBoxes] = useState<DeliveryBoxCollection | null>(null);

  function fetchBoxes() {
    if (map.getZoom() < 14) {
      setBoxes(null);
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/delivery-boxes?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setBoxes(data));
  }

  useEffect(() => {
    fetchBoxes();
  }, []);

  useMapEvents({ moveend: fetchBoxes, zoomend: fetchBoxes });

  if (!boxes) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={100}
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
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={deliveryBoxIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
