import { PropertiesImageI } from "./PropertyImagesI";
import { UserI } from "./UserI";

export interface PropertyI {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  url: string;
  latitude: number;
  longitude: number;
  bedrooms: string;
  bathrooms: string;
  featuredImage: string;
  featuredImageId: string;
  distance: number;
  propertiesImages: PropertiesImageI[];
  user: UserI;
}
