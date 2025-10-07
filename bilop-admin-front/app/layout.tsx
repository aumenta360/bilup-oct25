import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toast } from "../components/ui/toast"
import { AuthProvider } from "../providers/AuthProvider"
import { ThemeProvider } from "../providers/ThemeProvider"
import ClientOnly from "../components/client-only"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BILUP - Sistema de Fidelización",
  description: "Sistema de gestión de programas de fidelización para negocios",
  icons: {
    icon: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <ClientOnly>
              <Toast />
            </ClientOnly>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
