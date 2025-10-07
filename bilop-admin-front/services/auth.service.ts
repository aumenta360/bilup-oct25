import type { User } from "../types/user"
import { API_ENDPOINTS } from "../config/api"
import { api } from "./api.service"

interface LoginResponse {
  user: User;
  access_token: string;
}

const TOKEN_EXPIRY_TIME = 1000 * 60 * 60; // 1 hora en milisegundos

class AuthService {
  private tokenExpiryTimer: NodeJS.Timeout | null = null;

  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
      console.log('AuthService: Iniciando login con credenciales:', credentials);
      
      const data = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
      console.log('AuthService: Datos recibidos:', data);
      
      // Guardar en localStorage con timestamp
      const tokenData = {
        token: data.access_token,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('token', JSON.stringify(tokenData));
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Configurar el temporizador de expiración
      this.setupTokenExpiry();
      
      return data;
    } catch (error) {
      console.error('AuthService: Error en login:', error);
      throw error;
    }
  }

  private setupTokenExpiry() {
    // Limpiar temporizador existente si hay uno
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }

    // Configurar nuevo temporizador
    this.tokenExpiryTimer = setTimeout(() => {
      this.clearSession();
    }, TOKEN_EXPIRY_TIME);

    // También verificar si el token ha expirado por inactividad
    window.addEventListener('mousemove', this.resetTokenExpiry);
    window.addEventListener('keypress', this.resetTokenExpiry);
  }

  private resetTokenExpiry = () => {
    const tokenData = this.getTokenData();
    if (!tokenData) return;

    const now = new Date().getTime();
    const tokenAge = now - tokenData.timestamp;

    if (tokenAge > TOKEN_EXPIRY_TIME) {
      this.clearSession();
    } else {
      // Actualizar timestamp
      localStorage.setItem('token', JSON.stringify({
        ...tokenData,
        timestamp: now
      }));
      
      // Reiniciar temporizador
      this.setupTokenExpiry();
    }
  }

  private getTokenData(): { token: string; timestamp: number } | null {
    const tokenStr = localStorage.getItem('token');
    if (!tokenStr) return null;

    try {
      return JSON.parse(tokenStr);
    } catch {
      return null;
    }
  }

  // Método privado para limpiar la sesión sin llamar al servidor
  private clearSession(): void {
    // Limpiar event listeners
    window.removeEventListener('mousemove', this.resetTokenExpiry);
    window.removeEventListener('keypress', this.resetTokenExpiry);
    
    // Limpiar temporizador
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bilop_token');
    localStorage.removeItem('bilop_user');

    // Redirigir al login si no estamos ya ahí
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  async register(userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
  }): Promise<User> {
    try {
      const transformedData = {
        firstName: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: 'user'
      };

      const data = await api.post<{ user: User }>(API_ENDPOINTS.auth.register, transformedData);
      return data.user;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const tokenData = this.getTokenData();
      
      // Solo intentar hacer logout en el servidor si hay un token válido y no ha expirado
      if (tokenData) {
        const now = new Date().getTime();
        const tokenAge = now - tokenData.timestamp;
        
        if (tokenAge <= TOKEN_EXPIRY_TIME) {
          try {
            await api.post(API_ENDPOINTS.auth.logout, {});
          } catch (error) {
            console.warn('Error al hacer logout en el servidor:', error);
            // Continuamos con el proceso aunque falle la llamada al servidor
          }
        }
      }
    } finally {
      // Siempre limpiar la sesión local, independientemente de si la llamada al servidor tuvo éxito
      this.clearSession();
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    const tokenData = this.getTokenData();
    if (!tokenData) return null;

    const now = new Date().getTime();
    if (now - tokenData.timestamp > TOKEN_EXPIRY_TIME) {
      this.clearSession(); // Solo limpiar la sesión, no hacer logout
      return null;
    }

    return tokenData.token;
  }
}

export const authService = new AuthService(); 