'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import ClientOnly from "../components/client-only";
import { safeLocalStorage } from "../lib/localStorage";

// Definir tipo para contexto de tema 
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// Crear contexto con valores predeterminados
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

// Hook personalizado para usar el contexto de tema
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState('light');

  // Cargar tema al inicio
  useEffect(() => {
    const storedTheme = safeLocalStorage.getItem('theme');
    if (storedTheme) {
      setThemeState(storedTheme);
    }
  }, []);

  // Función para cambiar el tema
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    safeLocalStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ClientOnly>
        <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem>
          {children}
        </NextThemesProvider>
      </ClientOnly>
    </ThemeContext.Provider>
  );
} 