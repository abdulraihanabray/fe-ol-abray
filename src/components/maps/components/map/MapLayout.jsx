import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { BiPolygon } from "react-icons/bi";
import { PiLineSegmentFill } from "react-icons/pi";

import { ButtonMap } from "../button/ButtonMap";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useMap } from "../../hooks/useMap";
import DrawVector from "../draw/DrawVector";

/**
 * Initializes a map component with an OpenStreetMap layer and a default view.
 *
 * @return {JSX.Element} A div element containing the map component.
 */
const MapComponent = () => {
  const { mapInstance, addInteractions, handleZoom, mapRef, vectorSourceRef } =
    useMap();

  return (
    <div className="relative w-screen h-screen ">
      <div ref={mapRef} className="w-full h-full"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 gap-2">
        <ButtonMap onClick={() => handleZoom(mapInstance, +2)}>
          <FaSearchPlus />
        </ButtonMap>
        <ButtonMap onClick={() => handleZoom(mapInstance, -2)}>
          <FaSearchMinus />
        </ButtonMap>
        <ButtonMap
          onClick={() =>
            addInteractions(
              vectorSourceRef.current,
              mapInstance.current,
              "Polygon"
            )
          }
        >
          <BiPolygon />
        </ButtonMap>
        <ButtonMap
          onClick={() =>
            addInteractions(
              vectorSourceRef.current,
              mapInstance.current,
              "LineString"
            )
          }
        >
          <PiLineSegmentFill />
        </ButtonMap>
        <ButtonMap
          onClick={() =>
            addInteractions(
              vectorSourceRef.current,
              mapInstance.current,
              "Point"
            )
          }
        >
          <HiOutlineLocationMarker />
        </ButtonMap>
      </div>

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
