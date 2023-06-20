import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import getCenter from "geolib/es/getCenter";
import { env } from "~/env.mjs";

export const Map = () => {
  //   Transform coordinates into required array of objects in the correct shape
  const coordinates = [{
    latitude: 26.58957,
    longitude: -82.033984,
  }];


  // The latitude and longitude of the center of locations coordinates
  const centerResult = getCenter(coordinates);
  const center = centerResult !== false ? centerResult : {latitude: 0, longitude: 0}

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/maxforbang/cli7y6ibm05bj01pa1kuzc7cc"
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_KEY}
      {...viewport}
      onMove={(nextViewport) => setViewport({...viewport, ...nextViewport.viewState})}
    >
    </ReactMapGL>
  );
};

export default Map;