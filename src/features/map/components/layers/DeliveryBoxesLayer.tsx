"use client";
import { useEffect, useState } from "react";
import { useMap, useMapEvents, GeoJSON } from "react-leaflet";

export default function DeliveryBoxesLayer() {
  const map = useMap();
  const [boxes, setBoxes] = useState();

  function fetchBoxes() {
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
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/delivery-boxes?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setBoxes(data)); // GeoJSON data
  }

  // useEffect runs code after the component first renders.
  useEffect(() => {
    fetchBoxes();
  }, []); // run once on mount, never again

  // re-fetch on moveend
  useMapEvents({ moveend: fetchBoxes }); // pass the func (don't call it yet)

  if (!boxes) return null;

  // render with GeoJSON
  // JSON.stringify: JS obj -> string
  return <GeoJSON key={JSON.stringify(boxes)} data={boxes} />;
}
