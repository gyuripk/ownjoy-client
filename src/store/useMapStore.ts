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
  zoomIn: (() => void) | null;
  zoomOut: (() => void) | null;
  selectedPlace: SelectedPlace | null;
  currentLocation: { lat: number; lng: number } | null;
  setFlyTo: (fn: (lat: number, lng: number) => void) => void;
  setFitBounds: (fn: (bounds: [[number, number], [number, number]]) => void) => void;
  setZoomIn: (fn: () => void) => void;
  setZoomOut: (fn: () => void) => void;
  setSelectedPlace: (place: SelectedPlace | null) => void;
  setCurrentLocation: (loc: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  flyTo: null,
  fitBounds: null,
  zoomIn: null,
  zoomOut: null,
  selectedPlace: null,
  currentLocation: null,
  setFlyTo: (fn) => set({ flyTo: fn }),
  setFitBounds: (fn) => set({ fitBounds: fn }),
  setZoomIn: (fn) => set({ zoomIn: fn }),
  setZoomOut: (fn) => set({ zoomOut: fn }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
}));
