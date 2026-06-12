"use client";
import dynamic from "next/dynamic";

// Client components:
const Map = dynamic(() => import("../features/map/components/Map"), {
  ssr: false,
  loading: () => <div>Loading the map..</div>,
});

export default function Home() {
  return (
    <div>
      <Map />
    </div>
  );
}
