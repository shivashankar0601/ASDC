import { UserI } from "./UserI";

export interface AuthResponseI {
  user: UserI;
  accessToken: string;
  refreshToken: string;
}
