import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { BiPolygon } from "react-icons/bi";
import { PiLineSegmentFill } from "react-icons/pi";

import { ButtonMap } from "../button/ButtonMap";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useMap } from "../hooks/useMap";
import DrawVector from "../../draw/DrawVector";
import { useContext } from "react";
import { MapContext } from "../context/MapContext";

/**
 * Initializes a map component with an OpenStreetMap layer and a default view.
 *
 * @return {JSX.Element} A div element containing the map component.
 */
const MapComponent = () => {
  // const { mapInstance, addInteractions, handleZoom, mapRef, vectorSourceRef } =
  useMap();
  const { mapInstance, addInteractions, handleZoom, mapRef, vectorSourceRef } =
    useContext(MapContext);

  console.log(useContext(MapContext));

  return (
    <div className="relative w-screen h-screen ">
      <div ref={mapRef} className="w-full h-full"></div>

      <DrawVector
        handleZoom={handleZoom}
        mapInstance={mapInstance}
        addInteractions={addInteractions}
        vectorSourceRef={vectorSourceRef}
      />
    </div>
  );
};

export default MapComponent;
