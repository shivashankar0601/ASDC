import { createContext, useEffect, useState } from "react";
import { PropertyI } from "../interface/PropertyI";
import { UserI } from "../interface/UserI";

export interface ContextI {
  user: UserI | null;
  setUser: React.Dispatch<React.SetStateAction<UserI | null>>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  isGlobalLoading: boolean;
  setIsGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  houseType: string;
  setHouseType: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  kms: string;
  setKms: React.Dispatch<React.SetStateAction<string>>;
  rooms: string;
  setRooms: React.Dispatch<React.SetStateAction<string>>;
  properties: PropertyI[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyI[]>>;
}

export const Context = createContext<ContextI | null>(null);

export const ContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const [houseType, setHouseType] = useState("house");
  const [price, setPrice] = useState("1000-2000");
  const [kms, setKms] = useState("2-5");
  const [rooms, setRooms] = useState("2");
  const [properties, setProperties] = useState<PropertyI[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user") || "{}") as UserI;
    const token = localStorage.getItem("accessToken");
    if (data && data.email && token && token.trim().length) {
      setUser(data);
      setAccessToken(token);
    }
    setIsGlobalLoading(false);
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        isGlobalLoading,
        setIsGlobalLoading,
        houseType,
        setHouseType,
        kms,
        setKms,
        price,
        setPrice,
        setRooms,
        rooms,
        properties,
        setProperties,
      }}
    >
      {children}
    </Context.Provider>
  );
};
