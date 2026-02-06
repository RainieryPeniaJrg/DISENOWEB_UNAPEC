import { Imagen } from "./domain.models";

export interface AuthResponse {
  message: string;
  accedido: boolean;
  userId: string;
  name: string;
  email: string;
  roleId: string;
  createdAt: string;
  imagenes: Imagen[];
  passwordHash?: string;
}
