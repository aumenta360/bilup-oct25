"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import type { User } from "../types/user"
import { authService } from "../services/auth.service"
import ClientOnly from "../components/client-only"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar el estado de usuario en el cliente
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, [])

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  }

  if (isLoading) {
    return null; // No renderizar nada durante la carga inicial
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
