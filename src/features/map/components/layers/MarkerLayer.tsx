// import modules
import L from "leaflet";
import { Marker, Popup } from "react-leaflet"; // useMap: hooks
import "leaflet/dist/leaflet.css";

const myCustomIcon = L.icon({
  iconUrl: "/map-pin.svg", // public folder
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// mock data
const markers = [
  {
    id: 1,
    position: [37.5665, 126.978] as [number, number],
    title: "서울시청",
  },
  { id: 2, position: [37.551, 126.988] as [number, number], title: "남산타워" },
];

export default function MarkerLayer() {
  return (
    <>
      {markers.map((m) => (
        <Marker key={m.id} position={m.position} icon={myCustomIcon}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
    </>
  );
}
