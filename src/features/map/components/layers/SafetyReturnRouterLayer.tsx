"use client";

import { useEffect, useState } from "react";
import { useMap, useMapEvents, GeoJSON } from "react-leaflet";

export default function SafeReturnRouteLayer() {
  const map = useMap();
  const [routes, setRoutes] = useState();

  function fetchRoutes() {
    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(",");

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/routes?bbox=${bbox}`,
    )
      .then((res) => res.json())
      .then((data) => setRoutes(data));
  }

  useEffect(() => {
    fetchRoutes();
  }, []);

  useMapEvents({
    moveend: fetchRoutes,
  });

  if (!routes) return null;

  return <GeoJSON key={JSON.stringify(routes)} data={routes} />;
}
