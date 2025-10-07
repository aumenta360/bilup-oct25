import { User } from "../types/user"
import { api } from './api.service'

// Datos mockeados para el servicio de usuarios
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 1",
  },
  {
    id: "2",
    firstName: "María",
    lastName: "García",
    email: "maria@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 2",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "López",
    email: "carlos@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 3",
  },
  {
    id: "4",
    firstName: "Ana",
    lastName: "Rodríguez",
    email: "ana@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 4",
  },
  {
    id: "5",
    firstName: "Pedro",
    lastName: "Martínez",
    email: "pedro@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 5",
  }
];

export const userService = {
  async getUsers(): Promise<User[]> {
    // Devolvemos los datos mockeados directamente
    return Promise.resolve(mockUsers);
  },

  async deleteUser(id: string): Promise<void> {
    // Simulamos una operación exitosa
    return Promise.resolve();
  },

  async createUser(userData: Partial<User>): Promise<User> {
    // Simulamos la creación de un usuario
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: userData.firstName || "Nuevo",
      lastName: userData.lastName || "Usuario",
      email: userData.email || "nuevo@ejemplo.com",
      role: userData.role || "admin",
      createdAt: new Date().toISOString(),
      company: userData.company || "Empresa 1"
    };
    
    return Promise.resolve(newUser);
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    // Simulamos la actualización de un usuario
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return Promise.reject(new Error("Usuario no encontrado"));
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
      company: userData.company || "Empresa 1"
    };
    
    return Promise.resolve(updatedUser);
  },

  async getUserById(id: string): Promise<User> {
    // Simulamos obtener un usuario por ID
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return Promise.reject(new Error("Usuario no encontrado"));
    }
    
    return Promise.resolve(user);
  }
} 