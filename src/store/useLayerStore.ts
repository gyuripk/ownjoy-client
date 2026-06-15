import { create } from "zustand";

// define type of state
interface LayerState {
  visibleLayers: string[]; // list of checked layers
  toggleLayer: (id: string) => void; // toggle button
  selectExclusively: (id: string, groupIds: string[]) => void;
}

// create Layer Store
export const useLayerStore = create<LayerState>((set) => ({
  visibleLayers: [], // empty list

  // run this part when you click toggle button
  toggleLayer: (id) =>
    set((state) => ({
      visibleLayers: state.visibleLayers.includes(id)
        ? state.visibleLayers.filter((i) => i !== id)
        : [...state.visibleLayers, id],
    })),

  selectExclusively: (id, groupIds) =>
    set((state) => ({
      visibleLayers: state.visibleLayers.includes(id)
        ? state.visibleLayers.filter((l) => l !== id)
        : [...state.visibleLayers.filter((l) => !groupIds.includes(l)), id],
    })),
}));
