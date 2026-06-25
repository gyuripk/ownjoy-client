"use client";
import "./cluster-styles.css";
import L from "leaflet";
import { getBbox } from "../../utils/mapUtils";
import { createMarkerIcon } from "./markerIcon";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// define interface (types)
interface PoliceFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    source_id: string;
    name: string;
    facility_type: string;
    road_address: string;
    police_agency: string;
    police_station: string;
  };
}

interface PoliceCollection {
  type: "FeatureCollection";
  features: PoliceFeature[];
}

// create Marker Icon
const policeStationIcon = createMarkerIcon(
  "/icon-police-station.svg",
  "police-station-marker",
);
const districtOfficeIcon = createMarkerIcon(
  "/icon-district-office.svg",
  "police-district-marker",
);
const substationIcon = createMarkerIcon(
  "/icon-substation.svg",
  "police-sub-marker",
);
const boothIcon = createMarkerIcon(
  "/icon-police-booth.svg",
  "police-booth-marker",
);

function getPoliceIcon(facilityType: string) {
  switch (facilityType) {
    case "경찰서":
      return policeStationIcon;
    case "지구대":
      return districtOfficeIcon;
    case "파출소":
      return substationIcon;
    case "치안센터":
      return boothIcon;
    default:
      return policeStationIcon;
  }
}

// fetch function
async function fetchPolices(bbox: string): Promise<PoliceCollection> {
  // send request with bbox
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/police-facilities?bbox=${bbox}`,
  );
  return res.json();
}
// export component
export default function PoliceFacilitiesLayer() {
  // create map
  const map = useMap();
  const [polices, setPolices] = useState<PoliceCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 11) return;
    fetchPolices(getBbox(map)).then(setPolices);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 11) return void setPolices(null);
      fetchPolices(getBbox(map)).then(setPolices);
    },
    zoomend: () => {
      if (map.getZoom() < 11) return void setPolices(null);
      fetchPolices(getBbox(map)).then(setPolices);
    },
  });

  if (!polices) return null;

  return (
    <MarkerClusterGroup
      maxClusterRadius={250}
      disableClusteringAtZoom={14}
      spiderfyOnMaxZoom={false}
      iconCreateFunction={(cluster: { getChildCount: () => number }) =>
        L.divIcon({
          html: `<div class="cluster police-cluster">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: [36, 36],
        })
      }
    >
      {polices.features.map((feature, index) => (
        <Marker
          key={index}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={getPoliceIcon(feature.properties.facility_type)}
        />
      ))}
    </MarkerClusterGroup>
  );
}
