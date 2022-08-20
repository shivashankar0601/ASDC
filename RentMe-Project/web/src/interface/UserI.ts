export interface UserI {
  email: string;
  fullname: string;
  role: RoleI;
  id: number;
  createdAt: Date;
}

export interface RoleI {
  id: number;
  name: string;
  createdAt: Date;
}
