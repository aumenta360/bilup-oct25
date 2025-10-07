import { Role } from '../entities/user.entity/user.entity';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthdate?: Date;
  gender?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  birthdate?: Date;
  gender?: string;
  role?: Role;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  birthdate?: Date;
  gender?: string;
  role?: Role;
} 