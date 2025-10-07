"use client"

import { BarChart, Download, TrendingUp, TrendingDown, Users, Award, RefreshCcw } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useState } from "react"
import type { Analytics, Program } from "../../../types/analytics"

interface DashboardAnalyticsProps {
  program: Program | undefined
  analyticsData: Analytics
}

const DashboardAnalytics = ({ program, analyticsData }: DashboardAnalyticsProps) => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("30dias")

  // Validación de datos
  if (!analyticsData) {
    return (
      <div className="p-6">
        <p>Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Estadísticas de {program?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Analiza el rendimiento de tu programa de fidelización</p>
        </div>

        <div className="flex gap-2 items-center">
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 días</SelectItem>
              <SelectItem value="30dias">Últimos 30 días</SelectItem>
              <SelectItem value="90dias">Últimos 90 días</SelectItem>
              <SelectItem value="anual">Año actual</SelectItem>
              <SelectItem value="personalizado">Periodo personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold">{analyticsData.activeCustomers || 0}</span>
              </div>
              <div
                className={`flex items-center ${(analyticsData.customerGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {(analyticsData.customerGrowth || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(analyticsData.customerGrowth || 0)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. periodo anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premios Canjeados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-2xl font-bold">{analyticsData.redeemedPoints || 0}</span>
              </div>
              <div
                className={`flex items-center ${(analyticsData.pointsGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {(analyticsData.pointsGrowth || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(analyticsData.pointsGrowth || 0)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. periodo anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RefreshCcw className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-2xl font-bold">{analyticsData.retentionRate || 0}%</span>
              </div>
              <div
                className={`flex items-center ${(analyticsData.retentionRate || 0) > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {(analyticsData.retentionRate || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(analyticsData.retentionRate || 0)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. periodo anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-2xl font-bold">${analyticsData.averageTicket || 0}</span>
              </div>
              <div
                className={`flex items-center ${(analyticsData.ticketGrowth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {(analyticsData.ticketGrowth || 0) > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(analyticsData.ticketGrowth || 0)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs. periodo anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actividad" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="premios">Premios</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
        </TabsList>

        <TabsContent value="actividad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad del programa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Gráfico de actividad del programa</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Gráfico de análisis de clientes</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Premios canjeados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Gráfico de premios canjeados</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impacto en ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Gráfico de impacto en ventas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardAnalytics;