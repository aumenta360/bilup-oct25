"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Button } from "../../../components/ui/button"
import { Users, CreditCard, TrendingUp, Settings, Share2, QrCode, BarChart4, Award } from "lucide-react"
import type { Program } from "@/types/loyalty"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface DashboardProgramProps {
  program: Program
}

export function DashboardProgram({ program }: DashboardProgramProps) {
  const [activeTab, setActiveTab] = useState("resumen")

  // Función para obtener el icono según el tipo de programa
  const getTipoIcon = () => {
    switch (program.type) {
      case "stamps":
        return <Award className="h-5 w-5 mr-2" />
      case "prepaid":
        return <CreditCard className="h-5 w-5 mr-2" />
      case "levels":
        return <Award className="h-5 w-5 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{program.name}</h1>
            <Badge variant={program.active ? "default" : "secondary"} className="ml-3">
              {program.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
            {getTipoIcon()}
            <span>Programa de {program.type === "stamps" ? "Estampillas" : program.type === "prepaid" ? "Prepago" : "Niveles"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <QrCode className="h-4 w-4 mr-2" />
            Generar QR
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-2xl font-bold">{program.totalCustomers}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{Math.floor(Math.random() * 10) + 1} nuevos esta semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Premios Canjeados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-2xl font-bold">{program.totalRedemptions}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{Math.floor(Math.random() * 5) + 1} en los últimos 7 días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Puntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-2xl font-bold">{program.totalPoints}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.random() > 0.5 ? "+" : "-"}
                  {Math.floor(Math.random() * 5) + 1}% vs. mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vista previa de la tarjeta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div
                  className="w-full max-w-md mx-auto aspect-[1.6/1] rounded-xl shadow-lg p-6 flex flex-col justify-between"
                  style={{
                    backgroundColor: program.design.primaryColor || "#3B82F6",
                    color: program.design.textColor || "#FFFFFF",
                  }}
                >
                  <div className="flex justify-between items-start">
                    {program.design.logo ? (
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden relative">
                        <Image
                          src={program.design.logo}
                          alt="Logo del programa"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Logo</span>
                      </div>
                    )}
                    <div className="text-right">
                      <h3 className="text-xl font-bold">{program.name.toUpperCase()}</h3>
                      <p className="text-sm opacity-80">Tarjeta de Fidelización</p>
                    </div>
                  </div>

                  {program.design.stampImage && (
                    <div className="my-4 relative h-24 w-full rounded-lg overflow-hidden">
                      <Image
                        src={program.design.stampImage}
                        alt="Imagen del programa"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-70">Miembro desde</p>
                        <p className="text-sm font-medium">{new Date(program.createdAt).toLocaleDateString()}</p>
                      </div>
                      {program.type === "stamps" && (
                        <div className="flex space-x-1">
                          {Array.from({ length: program.requiredStamps }).map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${program.design.secondaryColor || "#FFFFFF"}40` }}
                            >
                              <div
                                className={`w-4 h-4 rounded-full`}
                                style={{
                                  backgroundColor:
                                    i < Math.floor(program.totalPoints / program.pointsPerPurchase)
                                      ? program.design.secondaryColor || "#FFFFFF"
                                      : `${program.design.secondaryColor || "#FFFFFF"}40`,
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aquí se mostraría la lista de clientes registrados en este programa de fidelización.
              </p>
              <div className="border rounded-md p-4 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>Ejemplo de listado de clientes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del programa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aquí se mostrarían gráficos y estadísticas detalladas del programa.
              </p>
              <div className="border rounded-md p-4 text-center">
                <BarChart4 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>Ejemplo de gráficos y estadísticas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del programa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aquí se mostrarían las opciones de configuración del programa.
              </p>
              <div className="border rounded-md p-4 text-center">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>Ejemplo de opciones de configuración</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
