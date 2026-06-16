"use client";

import { useEffect, useState } from "react";
import { useMap, useMapEvents, GeoJSON } from "react-leaflet";
import { getBbox } from "../../utils/mapUtils";

type RouteCollection = GeoJSON.FeatureCollection;

async function fetchRoutes(bbox: string): Promise<RouteCollection> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/safety/routes?bbox=${bbox}`,
  );
  return res.json();
}

export default function SafeReturnRouteLayer() {
  const map = useMap();
  const [routes, setRoutes] = useState<RouteCollection | null>(null);

  useEffect(() => {
    if (map.getZoom() < 12) return;
    fetchRoutes(getBbox(map)).then(setRoutes);
  }, [map]);

  useMapEvents({
    moveend: () => {
      if (map.getZoom() < 12) return void setRoutes(null);
      fetchRoutes(getBbox(map)).then(setRoutes);
    },
    zoomend: () => {
      if (map.getZoom() < 12) return void setRoutes(null);
      fetchRoutes(getBbox(map)).then(setRoutes);
    },
  });

  if (!routes) return null;

  return (
    <GeoJSON
      key={JSON.stringify(routes)}
      data={routes}
      style={{ color: "#00c976", weight: 4, opacity: 0.85 }}
    />
  );
}
