'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';


// Define el tipo para el usuario
interface User {
  id: string | number;  // Permitir tanto string como number para el id
  email: string;
  role: string;
  [key: string]: any; // Para cualquier otro campo que pueda tener
}

// Define la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Función para limpiar el almacenamiento
  const clearStorage = () => {
    console.log('Limpiando almacenamiento...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bilop_token');
    localStorage.removeItem('bilop_user');
    sessionStorage.clear();
    setUser(null);
    setToken(null);
    // Eliminar todas las cookies relacionadas
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  // Función para verificar la validez del token
  const isTokenValid = (tokenData: any): boolean => {
    if (!tokenData) return false;
    
    try {
      const { timestamp } = JSON.parse(tokenData);
      const now = new Date().getTime();
      const tokenAge = now - timestamp;
      // Token expira después de 1 hora
      return tokenAge < 1000 * 60 * 60;
    } catch {
      return false;
    }
  };

  // Función para guardar los datos de autenticación
  const saveAuthData = (token: string, user: User) => {
    // Guardar en localStorage
    const tokenData = {
      token,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('token', JSON.stringify(tokenData));
    localStorage.setItem('user', JSON.stringify(user));

    // Guardar token en cookie
    document.cookie = `token=${token}; path=/; max-age=3600; samesite=lax`;
  };

  // Función para verificar el estado de autenticación al cargar
  const checkAuth = async (): Promise<boolean> => {
      try {
      setIsLoading(true);
      console.log('Verificando autenticación...');
      
      // Si estamos en la página de login, limpiar todo
      if (window.location.pathname === '/login') {
        console.log('En página de login, limpiando storage...');
        clearStorage();
        setIsLoading(false);
        return false;
      }

      const tokenData = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Datos almacenados:', { tokenData, userData });
      
      // Verificar si el token es válido
      if (!tokenData || !userData || !isTokenValid(tokenData)) {
        console.log('Token inválido o expirado');
        clearStorage();
        setIsLoading(false);
        router.push('/login');
        return false;
      }

      // Parsear los datos
      const parsedToken = JSON.parse(tokenData).token;
      const parsedUser = JSON.parse(userData);
      
      setToken(parsedToken);
      setUser(parsedUser);
      
      setIsLoading(false);
      return true;
      } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      clearStorage();
      setIsLoading(false);
      router.push('/login');
      return false;
    }
  };

  // Verificar autenticación al cargar el componente y configurar listener para cierre de ventana
  useEffect(() => {
    checkAuth();

    // Limpiar storage cuando se cierra la ventana
    // const handleUnload = () => {
    //   clearStorage();
    // };

    // window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      // window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Iniciando proceso de login...');
      setIsLoading(true);
      
      // Limpiar storage antes del login
      clearStorage();
      
      const response = await authService.login({ email, password });
      console.log('Respuesta del login:', response);
      
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta de login inválida');
      }

      // Guardar datos en localStorage
      saveAuthData(response.access_token, response.user);
      
      // Actualizar estado
      setToken(response.access_token);
      setUser(response.user);
      
      console.log('Login exitoso:', { user: response.user });
      
      // Asegurarnos que el estado se actualice antes de la redirección
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar que los datos se hayan guardado correctamente
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (!savedToken || !savedUser) {
        throw new Error('Error al guardar datos de autenticación');
      }
      
      setIsLoading(false);
      
      // Usar replace en lugar de push para evitar problemas de historial
      console.log('Redirigiendo al dashboard...');
      router.replace('/dashboard');
      
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      clearStorage();
      setIsLoading(false);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    console.log('Cerrando sesión...');
    clearStorage();
    router.push('/login');
  };

  // Valor del contexto que se proporcionará
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 
