import { Types } from 'mongoose';

import { Rol } from '../models/interfaces/types';
export interface IUserResponse {
  _id: string | Types.ObjectId;
  nombre?: string | null;
  email?: string | null;
  rol: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  passwordHash?: string | null;
  toObject?: () => any;
}

export interface CreateUserDTO {
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Rol;
}

export interface UpdateUserDTO {
  nombre?: string;
  email?: string;
}
