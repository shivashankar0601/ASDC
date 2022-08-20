import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { memo, useCallback, useContext, useState } from "react";
import { GOOGLE_API } from "../data/Constants";
import MapStyles from "../utils/MapStyles.json";
import useUserLocation from "../hooks/useUserLocation";
import { Context, ContextI } from "../data/Context";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MyMap = (props: any) => {
  const { coords } = useUserLocation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const { properties, kms } = useContext(Context) as ContextI;
  const navigate = useNavigate();

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: 44.65107,
        lng: -63.582687,
      }}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: MapStyles,
        mapTypeControl: false,
      }}
    >
      <>
        <Marker
          position={coords}
          icon="https://maps.google.com/mapfiles/ms/icons/blue.png"
        ></Marker>

        <Circle
          center={coords}
          radius={+kms.split("-")[1] * 1000}
          options={{
            fillColor: "#0AF",
            fillOpacity: 0.3,
            strokeOpacity: 0,
          }}
        />

        {properties.map((item, index) => (
          <Marker
            key={index}
            position={{
              lat: item.latitude,
              lng: item.longitude,
            }}
            icon={{
              path: "M54 26.267l7.555 7.3a.25.25 0 0 1-.174.43H54V62H40V44H24v18H10V34H2.618a.25.25 0 0 1-.174-.43L32 5l13 12.567V12h9z",
              fillColor: "yellow",
              fillOpacity: 1,
              strokeWeight: 0,
              rotation: 0,
              scale: 0.3,
              anchor: new google.maps.Point(15, 30),
            }}
            onClick={() => {
              navigate(`/property/${item.id}`);
            }}
          ></Marker>
        ))}
      </>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default memo(MyMap);
