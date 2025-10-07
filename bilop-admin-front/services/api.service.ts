import { API_URL, API_ENDPOINTS } from '../config/api';

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Tipos de errores
export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Función para construir la URL completa
function buildUrl(endpoint: string): string {
  // Asegurarse de que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Obtener el token del localStorage en cada solicitud para asegurar que sea actual
  let token = null;
  if (isBrowser) {
    const tokenStr = localStorage.getItem('token');
    if (tokenStr) {
      try {
        // Si es un objeto JSON, extraer el campo token
        const parsed = JSON.parse(tokenStr);
        token = parsed.token || tokenStr;
      } catch {
        // Si no es JSON, usar el string tal cual
        token = tokenStr;
      }
    }
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const url = buildUrl(endpoint);
    console.log('Haciendo petición a:', url); // Para debugging
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 && isBrowser) {
        // Si recibimos un 401 (No autorizado), limpiar el localStorage y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada o no válida');
      }
      
      // Para otros errores, intentar obtener un mensaje del cuerpo de la respuesta
      let errorMessage = `Error HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        const apiError: ApiError = {
          message: errorMessage,
          status: response.status,
          data: errorData
        };
        
        throw apiError;
      } catch (parseError) {
        throw {
          message: errorMessage,
          status: response.status
        } as ApiError;
      }
    }

    // Manejar respuestas vacías (como DELETE que puede devolver 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  
  post: <T>(endpoint: string, data: any) => 
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) => 
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: any) => 
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    request<T>(endpoint, {
      method: 'DELETE',
    }),
  
  upload: <T>(endpoint: string, formData: FormData) => 
    request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // No establecer Content-Type para FormData, el navegador lo hará automáticamente
      },
    }),
}; 