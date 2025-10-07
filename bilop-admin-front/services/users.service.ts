import { api } from './api.service';

export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  async getById(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  async create(user: CreateUserDto): Promise<User> {
    return api.post<User>('/users', user);
  },

  async update(id: number, user: Partial<CreateUserDto>): Promise<User> {
    return api.patch<User>(`/users/${id}`, user);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}; 