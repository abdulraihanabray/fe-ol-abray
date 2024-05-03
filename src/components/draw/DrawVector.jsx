import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { BiPolygon } from "react-icons/bi";
import { PiLineSegmentFill } from "react-icons/pi";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { ButtonMap } from "../maps/button/ButtonMap";

const DrawVector = ({
  handleZoom,
  mapInstance,
  addInteractions,
  vectorSourceRef,
}) => {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 gap-2">
      <ButtonMap onClick={() => handleZoom(mapInstance, +2)}>
        <FaSearchPlus />
      </ButtonMap>
      <ButtonMap onClick={() => handleZoom(mapInstance, -2)}>
        <FaSearchMinus />
      </ButtonMap>
      <ButtonMap
        onClick={() => addInteractions(vectorSourceRef, mapInstance, "Polygon")}
      >
        <BiPolygon />
      </ButtonMap>
      <ButtonMap
        onClick={() =>
          addInteractions(vectorSourceRef, mapInstance, "LineString")
        }
      >
        <PiLineSegmentFill />
      </ButtonMap>
      <ButtonMap
        onClick={() => addInteractions(vectorSourceRef, mapInstance, "Point")}
      >
        <HiOutlineLocationMarker />
      </ButtonMap>
    </div>
  );
};

export default DrawVector;
