import { useContext } from "react";
import { MapContext } from "../map/hooks/useMap";

export const useZoom = () => {
  const { mapLayerRef } = useContext(MapContext);

  const handleZoom = (value) => {
    const mapLayer = mapLayerRef.current;
    const view = mapLayer.getView();
    const currentZoom = view.getZoom();
    view.animate({ zoom: currentZoom + value, duration: 500 });
  };

  return { handleZoom };
};
