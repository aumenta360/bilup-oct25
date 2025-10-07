"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  ShoppingBag,
  CreditCard,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import type { Customer } from "../../types/customer"
import type { Sale } from "../../types/sale"
import type { Program } from "../../types/program"

interface CustomerProfileProps {
  customer: Customer
  sales: Sale[]
  programs: Program[]
}

export function CustomerProfile({ customer, sales, programs }: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")

  // Calculate statistics
  const totalPurchases = sales.reduce((sum, sale) => sum + sale.total, 0)
  const averageTicket = sales.length > 0 ? totalPurchases / sales.length : 0
  const lastPurchase = sales.length > 0 ? new Date(Math.max(...sales.map((s) => new Date(s.date).getTime()))) : null

  // Get customer's program
  const customerProgram = customer.programId ? programs.find((p) => p.id === customer.programId) : null

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/customers">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={customer.active ? "success" : "secondary"}>{customer.active ? "Activo" : "Inactivo"}</Badge>
              {customer.level && (
                <Badge variant="outline" className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-amber-500" />
                  {customer.level === "Gold" ? "Oro" : 
                   customer.level === "Silver" ? "Plata" : 
                   customer.level === "Bronze" ? "Bronce" : 
                   customer.level === "Platinum" ? "Platino" : customer.level}
                </Badge>
              )}
              <span className="text-gray-500 dark:text-gray-400">
                Cliente desde {new Date(customer.registrationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/customers/${customer.id}?edit=true`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <Trash2 className="h-4 w-4" />
            <span>Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Compras totales</p>
                <h2 className="text-3xl font-bold">${totalPurchases.toLocaleString()}</h2>
                <p className="text-xs text-gray-500 mt-1">{sales.length} transacciones</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket promedio</p>
                <h2 className="text-3xl font-bold">${averageTicket.toLocaleString()}</h2>
                <p className="text-xs text-gray-500 mt-1">Por transacción</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Programa</p>
                <h2 className="text-xl font-bold truncate">
                  {customerProgram ? customerProgram.name : "Sin programa"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {customer.level
                    ? `Nivel ${customer.level === "Gold" ? "Oro" : 
                        customer.level === "Silver" ? "Plata" : 
                        customer.level === "Bronze" ? "Bronce" : 
                        customer.level === "Platinum" ? "Platino" : customer.level}`
                    : customer.progress > 0
                      ? `${customer.progress} sellos`
                      : "Sin actividad"}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Última compra</p>
                <h2 className="text-xl font-bold">
                  {lastPurchase ? lastPurchase.toLocaleDateString() : "Sin compras"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {lastPurchase
                    ? `Hace ${Math.floor((Date.now() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24))} días`
                    : ""}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="purchases">Historial de compras</TabsTrigger>
          <TabsTrigger value="loyalty">Fidelización</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Correo electrónico</p>
                  <p className="text-gray-500">{customer.email}</p>
                </div>
              </div>

              {customer.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              )}

              {customer.birthDate && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Fecha de nacimiento</p>
                    <p className="text-gray-500">{new Date(customer.birthDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
