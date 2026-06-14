"use client";
import "./EmergencyBellLayer.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

interface BellFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
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

// custome icon
const emergencyBellIcon = L.icon({
  iconUrl: "/icon-emergency-bell.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function EmergencyBellLayer() {
  // create map
  const map = useMap();
  const [bells, setBells] = useState<BellCollection | null>(null);

  // fetch bells
  function fetchBells() {
    if (map.getZoom() < 14) {
      setBells(null);
      return;
    }
    // get bounds
    const bounds = map.getBounds();
    // build bbox
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(",");

    // fetch data from backend api
    // set bells with fetched data
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/emergency-bells?bbox=${bbox}`, // send bbox info using query
    )
      .then((res) => res.json()) // HTTP res -> JS ob
      .then((data) => setBells(data)); //GeoJSON data
  }

  useEffect(() => {
    fetchBells();
  }, []);

  // re-fetch when user move screen
  useMapEvents({ moveend: fetchBells, zoomend: fetchBells });

  if (!bells) return null;

  // render GeoJSON FeatureCollection
  return (
    <MarkerClusterGroup
      maxClusterRadius={100}
      disableClusteringAtZoom={16}
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
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={emergencyBellIcon}
        />
      ))}
    </MarkerClusterGroup>
  );
}
