import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Geocode from "react-geocode";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { GOOGLE_API } from "../data/Constants";

Geocode.setApiKey(GOOGLE_API);
Geocode.setLanguage("en");

export const defaultCoords = {
  lat: 44.65107,
  lng: -63.582687,
};

const useUserLocation = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    defaultCoords
  );

  const [address, setAddress] = useState("");

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: GOOGLE_API,
    });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          Geocode.fromLatLng(
            data.coords.latitude.toString(),
            data.coords.longitude.toString()
          ).then(
            (response) => {
              const address = response.results[0].formatted_address;
              setAddress(address);
              setCoords({
                lat: data.coords.latitude,
                lng: data.coords.longitude,
              });
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          toast.error(error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLocationPick = (address: string) => {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setAddress(address);
        setCoords({
          lat,
          lng,
        });
      },
      (error) => {
        console.log(error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 1500,
        });
      }
    );
    getPlacePredictions({ input: "" });
  };

  return {
    coords,
    setCoords,
    address,
    setAddress,
    placePredictions,
    isPlacePredictionsLoading,
    getPlacePredictions,
    handleLocationPick,
  };
};

export default useUserLocation;
