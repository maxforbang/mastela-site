import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import getCenter from "geolib/es/getCenter";
import { env } from "~/env.mjs";
import type { UnitDetails } from "~/pages/our-villas";

export const Map = ({ searchResults }: {searchResults: UnitDetails[]}) => {
  const [selectedLocation, setSelectedLocation] = useState<UnitDetails | object>({});

  //   Transform coordinates into required array of objects in the correct shape
  const coordinates = searchResults.map((result) => ({
    latitude: 26.58957,
    longitude: -82.033984,
  }));


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
        {searchResults.map((result: UnitDetails) => (
            <div key={result.long}>
                <Marker
                    longitude={result.long}
                    latitude={result.lat}
                >
                    <p 
                    onClick={() => setSelectedLocation(result)}
                    aria-label="push-pin"
                    role="img"
                    className="cursor-pointer text-2xl animate-pulse">📌</p>
                </Marker>

                {/* popup that shows if we click on a maker */}
                {(selectedLocation as UnitDetails).long  === result.long ? (
                    <Popup
                        onClose={() => setSelectedLocation({})}
                        closeOnClick={true}
                        latitude={result.lat}
                        longitude={result.long}
                    >
                        {result.title}
                    </Popup>
                ) : (
                    false
                )}
            </div>
        ))}
    </ReactMapGL>
  );
};

export default Map;