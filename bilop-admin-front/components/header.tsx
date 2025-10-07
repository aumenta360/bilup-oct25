"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/AuthProvider"

export default function Header() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)

  const handleLogout = async () => {
    try {
    await logout()
    router.push("/login")
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Si está cargando o no hay usuario, mostrar un placeholder
  if (isLoading || !user) {
    return (
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </header>
    )
  }

  // Función para obtener las iniciales del usuario
  const getUserInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (!firstName && !lastName) return '??';
    
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);
    
    if (!firstInitial && !lastInitial) return '??';
    if (!firstInitial) return lastInitial.toUpperCase();
    if (!lastInitial) return firstInitial.toUpperCase();
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const userInitials = getUserInitials();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2 lg:hidden">{/* Mobile menu button would go here */}</div>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notifications}
              </span>
            )}
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2" aria-label="Menú de usuario">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {userInitials}
                </div>
                <div className="hidden flex-col items-start text-sm md:flex">
                  <span className="font-medium">
                    {user.firstName || ''} {user.lastName || ''}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.company || 'Usuario'}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil" className="flex w-full cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracion" className="flex w-full cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
