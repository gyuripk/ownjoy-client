"use client";

import { WMSTileLayer } from "react-leaflet";
import { useLayerStore } from "@/store/useLayerStore";
import { WMS_LAYERS } from "../../config/layersConfig";

const safemapKey = process.env.NEXT_PUBLIC_SAFEMAP_API_KEY;

export default function WmsLayer() {
  // get layer state
  const visibleLayers = useLayerStore((state) => state.visibleLayers);

  return (
    <>
      {WMS_LAYERS.filter((layer) => visibleLayers.includes(layer.id)).map(
        (layer) => (
          <WMSTileLayer
            //
            key={layer.id}
            url={layer.url}
            layers={layer.layers}
            styles={layer.styles || ""}
            format={layer.format}
            transparent={layer.transparent}
            opacity={layer.opacity || 0.6} // default: 0.6
          />
        ),
      )}
    </>
  );
}
