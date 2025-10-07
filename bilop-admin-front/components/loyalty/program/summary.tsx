"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Users, Gift, Share2, Edit, BarChart, Stamp, CreditCard, Trophy } from "lucide-react"
import Link from "next/link"
import type { Program } from "@/types/loyalty"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { loyaltyService } from "@/services/loyalty-service"
import { useRouter } from "next/navigation"

interface SummaryProgramProps {
  program?: Program,
  id?: string | number
}

export function SummaryProgram({ program: initialProgram, id }: SummaryProgramProps) {
  const router = useRouter()
  const [program, setProgram] = useState<Program | null>(initialProgram || null)
  const [isLoading, setIsLoading] = useState(!initialProgram)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  useEffect(() => {
    if (!program && id) {
      setIsLoading(true)
      loyaltyService.getProgramById(Number(id))
        .then(data => setProgram(data))
        .catch(() => setProgram(null))
        .finally(() => setIsLoading(false))
    }
  }, [id, program])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  if (!program) {
    return <div className="p-6 text-red-500">No se encontró el programa.</div>
  }

  // Get icon based on program type
  const getTypeIcon = () => {
    switch (program.type) {
      case "stamps":
        return <Stamp className="h-4 w-4" />
      case "prepaid":
        return <CreditCard className="h-4 w-4" />
      case "levels":
        return <Trophy className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Volver atrás"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{program.name}</h1>
              <Badge variant={program.active ? "default" : "secondary"}>{program.active ? "Activo" : "Inactivo"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center">
                {getTypeIcon()}
                <span className="ml-1">
                  {program.type === "stamps" ? "Estampillas" : 
                   program.type === "prepaid" ? "Prepago" : 
                   "Niveles"}
                </span>
              </Badge>
              <span className="text-gray-500 dark:text-gray-400">
                Creado el {new Date(program.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/loyalty/program/${program.id}/share`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Compartir</span>
            </Button>
          </Link>
          <Link href={`/loyalty/program/${program.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          </Link>
          <Link href={`/loyalty/program/${program.id}/customers`}>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Ver clientes</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clientes registrados</p>
                <h2 className="text-3xl font-bold">{program.totalCustomers}</h2>
                <p className="text-xs text-green-500 mt-1">+{Math.floor(Math.random() * 10) + 1} usuarios activos</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {program.type === "stamps"
                    ? "Sellos otorgados"
                    : program.type === "prepaid"
                      ? "Saldo cargado"
                      : "Niveles alcanzados"}
                </p>
                <h2 className="text-3xl font-bold">{program.totalPoints}</h2>
                <p className="text-xs text-green-500 mt-1">+{Math.floor(Math.random() * 5) + 1} puntos por usuario</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                {program.type === "stamps" ? (
                  <Stamp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : program.type === "prepaid" ? (
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {program.type === "stamps"
                    ? "Recompensas canjeadas"
                    : program.type === "prepaid"
                      ? "Transacciones"
                      : "Clientes VIP"}
                </p>
                <h2 className="text-3xl font-bold">{program.totalRedemptions}</h2>
                <p className="text-xs text-amber-500 mt-1">
                  {program.type === "stamps"
                    ? "Valor aprox. $1,240"
                    : program.type === "prepaid"
                      ? "Promedio $24.50"
                      : "12% del total de clientes"}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Actividad del programa</CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 días</SelectItem>
                    <SelectItem value="30d">30 días</SelectItem>
                    <SelectItem value="90d">90 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="customers">
                <TabsList className="mb-4">
                  <TabsTrigger value="customers">Clientes</TabsTrigger>
                  <TabsTrigger value="activity">
                    {program.type === "stamps" ? "Sellos" : program.type === "prepaid" ? "Saldo" : "Niveles"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="customers">
                  <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-gray-400" />
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-gray-400" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalles del programa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de programa</h3>
                <p className="font-medium">
                  {program.type === "stamps" ? "Estampillas" : 
                   program.type === "prepaid" ? "Prepago" : 
                   "Niveles"}
                </p>
              </div>

              {program.type === "stamps" && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Configuración</h3>
                  <p className="font-medium">{program.requiredStamps} sellos para recompensa</p>
                  <p className="text-sm">{program.reward}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</h3>
                <p className="text-sm">{program.description || "No se especificó una descripción."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
