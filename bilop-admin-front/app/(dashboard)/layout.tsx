import type React from "react"
import type { Metadata } from "next"
import Sidebar from "../../components/sidebar"
import Header from "../../components/header"
import { AuthProvider } from "../../context/auth-context"

export const metadata: Metadata = {
  title: "Dashboard | BILOP - Sistema de Fidelización",
  description: "Panel de control de BILOP",
}

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden lg:block" />
        <div className="flex-1 lg:pl-64">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default DashboardLayout;
