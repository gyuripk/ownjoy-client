"use client";

import { useLayerStore } from "@/store/useLayerStore";
import { WMS_LAYERS } from "../config/layersConfig";

export function MapFilter() {
  // get layer state and func
  const visibleLayers = useLayerStore((state) => state.visibleLayers);
  const toggleLayer = useLayerStore((state) => state.toggleLayer);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        background: "white",
        padding: 10,
      }}
    >
      {WMS_LAYERS.map((layer) => (
        <label key={layer.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={visibleLayers.includes(layer.id)}
            onChange={() => {
              toggleLayer(layer.id);
              console.log("Selected layer: ", visibleLayers);
            }}
          />
          {layer.name}
        </label>
      ))}
    </div>
  );
}
