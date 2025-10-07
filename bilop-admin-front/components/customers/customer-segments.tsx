"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { PieChart, BarChart, Download, Plus, ArrowLeft, Users, Clock, ShoppingBag, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Segment } from "@/types/customer"

interface CustomerSegmentsProps {
  segments: Segment[]
}

export function CustomerSegments({ segments }: CustomerSegmentsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

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
            <h1 className="text-2xl font-bold">Segmentos de Clientes</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Analiza y gestiona tus segmentos de clientes
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Crear segmento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="segments" className="mb-6">
        <TabsList>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
          <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
          <TabsTrigger value="demographics">Demografía</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Segmentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {segments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
                        <span>{segment.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{segment.customers}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({segment.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Segmentos de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 p-3 bg-gray-50 dark:bg-gray-900 font-medium">
              <div className="col-span-3">Nombre</div>
              <div className="col-span-3">Descripción</div>
              <div className="col-span-2">Clientes</div>
              <div className="col-span-2">Valor Promedio</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            <div className="divide-y">
              {segments.map((segment) => (
                <div key={segment.id} className="grid grid-cols-12 p-3 items-center">
                  <div className="col-span-3 font-medium">{segment.name}</div>
                  <div className="col-span-3 text-sm text-gray-500">{segment.description}</div>
                  <div className="col-span-2">{segment.customers}</div>
                  <div className="col-span-2">${segment.averageValue?.toLocaleString() ?? 0}</div>
                  <div className="col-span-2 text-right">
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
