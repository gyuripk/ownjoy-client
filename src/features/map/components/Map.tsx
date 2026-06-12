"use client";

// import modules
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup } from "react-leaflet"; // useMap: hooks
import "leaflet/dist/leaflet.css";
import VectorTileLayer from "./layers/VectorTileLayer";
import WmsLayer from "./layers/WmsLayer";
import MarkerLayer from "./layers/MarkerLayer";
import { MapFilter } from "./MapFilter";

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
    // 2. 방금 검증한 백엔드 포트(5001) 주소로 데이터를 요청합니다.
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/test-markers`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 에러");
        return res.json();
      })
      .then((data: MarkerData[]) => {
        setMarkers(data); // 백엔드가 준 가짜 데이터 2개를 상태값에 저장
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
      {/* 4. 백엔드에서 받아온 배열을 돌면서 지도 위에 마커를 차곡차곡 꽂아줍니다. */}
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
      <MarkerLayer />
      <MapFilter />
    </MapContainer>
  );
}
