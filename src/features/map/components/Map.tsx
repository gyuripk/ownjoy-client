"use client";

// import modules
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup } from "react-leaflet"; // useMap: hooks
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import { MapFilter } from "./MapFilter";
import SafeReturnRouteLayer from "./layers/SafetyReturnRouterLayer";
import DeliveryBoxesLayer from "./layers/DeliveryBoxesLayer";

// define backend data type
interface MarkerData {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export default function Map() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    // 2. call test api (port: 5001)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/test-markers`)
      .then((res) => {
        if (!res.ok) throw new Error("Server Response Error");
        return res.json();
      })
      .then((data: MarkerData[]) => {
        setMarkers(data); // save mock data in state
      })
      .catch((err) => console.error("백엔드 통신 실패:", err));
  }, []);

  return (
    <MapContainer
      center={[37.5665, 126.978]} // lattitude , longitude
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Base map */}
      <VectorTileLayer />
      <WmsLayer />
      {/* display markers by looping */}
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <div>
              <h4>{marker.name}</h4>
              <p>마커 누르면 이 상세 정보 팝업이 뜹니다.</p>
            </div>
          </Popup>
        </Marker>
      ))}

      <SafeReturnRouteLayer />
      <DeliveryBoxesLayer />
      <MapFilter />
    </MapContainer>
  );
}
