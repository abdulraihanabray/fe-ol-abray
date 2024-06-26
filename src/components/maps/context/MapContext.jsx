import { createContext, useEffect, useMemo, useRef } from "react";

import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import {
  labelStyle,
  markerStyle,
  modifyStyle,
  segmentStyle,
  style,
  tipStyle,
} from "../../../assets/constant/vector-styles";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
import { Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { LineString, Point } from "ol/geom";
import { formatArea, formatLength } from "../utils/formatMap";
import { fromLonLat } from "ol/proj";
import { Draw, Modify } from "ol/interaction";

const MapContext = createContext();

// eslint-disable-next-line react/prop-types
const MapContextProvider = ({ children }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSourceRef = useRef(null);
  const vectorRef = useRef(null);
  const tipPointRef = useRef(null);
  const modifyRef = useRef(null);
  const tileLayer = useRef(null);

  const segmentStyles = [segmentStyle];

  useEffect(() => {
    const tile = new TileLayer({
      source: new OSM({
        url: "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      }),
    });

    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: [
        (feature) => styleFunction(tipPointRef, modifyRef, feature),
        markerStyle,
      ],
    });
    const modify = new Modify({ source: source, style: modifyStyle });

    const map = new Map({
      target: mapRef.current,
      layers: [tile, vector],
      view: new View({
        center: fromLonLat([107.60981, -6.914744]),
        zoom: 10,
      }),
      controls: [],
    });

    map.addInteraction(modify);

    mapInstance.current = map;
    vectorSourceRef.current = source;
    vectorRef.current = vector;
    modifyRef.current = modify;
    tileLayer.current = tile;

    return () => {
      map.setTarget(null);
    };
  }, []);

  const handleZoom = (mapRef, value) => {
    const map = mapRef.current;
    const view = map.getView();
    const zoom = view.getZoom();
    view.animate({ zoom: zoom + value, duration: 500 });
  };

  function styleFunction(tipPointRef, modifyRef, feature, drawType, tip) {
    const styles = [];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;
    if (!drawType || drawType === type || type === "Point") {
      styles.push(style);
      if (type === "Polygon") {
        point = geometry.getInteriorPoint();
        label = formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === "LineString") {
        point = new Point(geometry.getLastCoordinate());
        label = formatLength(geometry);
        line = geometry;
      }
    }
    if (line) {
      let count = 0;
      line.forEachSegment(function (a, b) {
        const segment = new LineString([a, b]);
        const label = formatLength(segment);
        if (segmentStyles.length - 1 < count) {
          segmentStyles.push(segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        segmentStyles[count].setGeometry(segmentPoint);
        segmentStyles[count].getText().setText(label);
        styles.push(segmentStyles[count]);
        count++;
      });
    }
    if (label) {
      labelStyle.setGeometry(point);
      labelStyle.getText().setText(label);
      styles.push(labelStyle);
    }
    if (
      tip &&
      type === "Point" &&
      !modifyRef.current.getOverlay().getSource().getFeatures().length
    ) {
      tipPointRef.current = geometry;
      tipStyle.getText().setText(tip);
      styles.push(tipStyle);
    }
    return styles;
  }

  function addInteractions(source, map, type) {
    map.current.removeInteraction(vectorRef.current);
    const activeTip =
      "Click to continue drawing the " +
      (type === "Polygon" ? "polygon" : "line");
    const idleTip = "Click to start measuring";
    let tip = idleTip;
    vectorRef.current = new Draw({
      source: source.current,
      type,
      style: function (feature) {
        return styleFunction(tipPointRef, modifyRef, feature, type, tip);
      },
    });
    vectorRef.current.on("drawstart", function () {
      modifyRef.current.setActive(false);
      tip = activeTip;
    });
    vectorRef.current.on("drawend", function () {
      modifyStyle.setGeometry(tipPointRef.current);
      modifyRef.current.setActive(true);
      map.current.once("pointermove", function () {
        modifyStyle.setGeometry();
      });
      tip = idleTip;
    });

    vectorRef.current.on("addfeature", function (e) {
      flash(e.feature);
    });
    modifyRef.current.setActive(true);
    map.current.addInteraction(vectorRef.current);
  }

  const flash = (feature) => {
    const duration = 3000;
    const start = Date.now();
    const flashGeom = feature.getGeometry().clone();
    const listenerKey = tileLayer.current.on("postrender", animate);

    function animate(event) {
      const frameState = event.frameState;
      const elapsed = frameState.time - start;
      const vectorContext = getVectorContext(event);
      const elapsedRatio = elapsed / duration;
      const radius = easeOut(elapsedRatio) * 50 + 5;
      const opacity = easeOut(1 - elapsedRatio);

      const style = new Style({
        image: new CircleStyle({
          radius: radius,
          stroke: new Stroke({
            color: "rgba(255, 0, 0, " + opacity + ")",
            width: 0.25 + opacity,
          }),
        }),
      });

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      mapInstance.current.render();

      if (elapsed >= duration) {
        unByKey(listenerKey);
        flash(feature);
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      addInteractions,
      handleZoom,
      mapRef,
      mapInstance,
      vectorSourceRef,
    }),
    [addInteractions, handleZoom, mapRef, mapInstance, vectorSourceRef]
  );
  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};

export { MapContext, MapContextProvider };
