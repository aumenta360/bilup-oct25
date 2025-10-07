import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from "../services/auth.service";

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

interface User {
  id: number;
  email: string;
  role: string;
}

// Usuario falso para bypass de autenticación
const mockUser: User = {
  id: 1,
  email: 'admin@bilop.com',
  role: 'admin'
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(mockUser); // Establecer el usuario mock por defecto
  const [loading, setLoading] = useState(false); // Iniciar como false para evitar pantallas de carga

  useEffect(() => {
    // Bypass completo de autenticación - Siempre está autenticado
    if (isBrowser) {
      // Establecer un token falso en localStorage si no existe
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'fake-token-for-development');
      }
      
      // Guardar datos del usuario mock en localStorage
      if (!authService.getUser()) {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Bypass de autenticación - Cualquier credencial es aceptada
    setUser(mockUser);
    
    // Redirigir directamente al dashboard
    router.push('/dashboard');
    return { success: true };
  };

  const logout = () => {
    // Mantiene el usuario y token para evitar desloguearse
    router.push('/dashboard'); // Redirección al dashboard en vez de login
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: true, // Siempre autenticado
  };
} 