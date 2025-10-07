"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Users, Star, Menu, X, Store, QrCode, LineChart, LucideIcon, Settings } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { useState } from "react"
import type { Route } from 'next'

interface SidebarProps {
  className?: string
}

interface RouteItem {
  type?: "divider"
  label?: string
  icon?: LucideIcon
  href?: Route
  active?: boolean
  subRoutes?: {
    label: string
    href: Route
    active: boolean
  }[]
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const routes: RouteItem[] = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      type: "divider"
    },
    {
      label: "Fidelización",
      icon: Star,
      href: "/loyalty",
      active: pathname?.startsWith("/loyalty"),
    },
    {
      type: "divider"
    },
    {
      label: "Clientes",
      icon: Users,
      href: "/customers",
      active: pathname?.startsWith("/customers"),
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/settings",
      active: pathname?.startsWith("/settings"),
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 z-40 p-4">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 lg:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={toggleMobileMenu}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span>BILUP</span>
          </Link>
          <Button variant="ghost" size="icon" className="absolute right-4 top-3 lg:hidden" onClick={toggleMobileMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {routes.map((route, index) => (
            route.type === "divider" ? (
              <div key={index} className="my-2 border-t border-gray-200 dark:border-gray-800" />
            ) : (
              <div key={route.href || index}>
                <Link
                  href={route.href || "#"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    route.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.icon && <route.icon className="h-5 w-5" />}
                  {route.label}
                </Link>
                {route.subRoutes && route.active && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {route.subRoutes.map((subRoute) => (
                      <Link
                        key={subRoute.href}
                        href={subRoute.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                          subRoute.active
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </nav>
      </aside>
    </>
  )
}
