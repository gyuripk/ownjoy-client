import { useRef } from "react";
import { useMapEvents } from "react-leaflet";

export function usePopupOpen() {
  const isOpen = useRef(false);
  useMapEvents({
    popupopen: () => { isOpen.current = true; },
    popupclose: () => { isOpen.current = false; },
  });
  return isOpen;
}
