"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type React from "react"

import { useEffect, useState } from "react"

// Definimos el tipo localmente en lugar de importarlo
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
  enableColorScheme?: boolean
  disableTransitionOnChange?: boolean
  forcedTheme?: string
  attribute?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Necesario para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem={true} {...props}>
      {children}
    </NextThemesProvider>
  )
}
