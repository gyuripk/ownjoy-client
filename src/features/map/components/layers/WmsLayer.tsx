"use client";

import { WMSTileLayer } from "react-leaflet";
import { useLayerStore } from "@/store/useLayerStore";
import { WMS_LAYERS } from "../../config/layersConfig";

export default function WmsLayer() {
  const visibleLayers = useLayerStore((state) => state.visibleLayers);

  return (
    <>
      {WMS_LAYERS.filter((layer) => visibleLayers.includes(layer.id)).map((layer) => (
        <WMSTileLayer
          key={layer.id}
          url={layer.url}
          layers={layer.layers}
          styles={layer.styles || ""}
          format={layer.format}
          transparent={layer.transparent ?? true}
          opacity={layer.opacity ?? 0.6}
        />
      ))}
    </>
  );
}
