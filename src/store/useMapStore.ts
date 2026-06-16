import { create } from "zustand";
import type { GeoJsonObject } from "geojson";

export interface SelectedPlace {
  lat: number;
  lng: number;
  geojson?: GeoJsonObject;
}

interface MapState {
  flyTo: ((lat: number, lng: number) => void) | null;
  fitBounds: ((bounds: [[number, number], [number, number]]) => void) | null;
  selectedPlace: SelectedPlace | null;
  setFlyTo: (fn: (lat: number, lng: number) => void) => void;
  setFitBounds: (fn: (bounds: [[number, number], [number, number]]) => void) => void;
  setSelectedPlace: (place: SelectedPlace | null) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  flyTo: null,
  fitBounds: null,
  selectedPlace: null,
  setFlyTo: (fn) => set({ flyTo: fn }),
  setFitBounds: (fn) => set({ fitBounds: fn }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
}));
