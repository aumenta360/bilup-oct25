"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Star, Gift, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import type { Program } from "../../types/program"

interface ProgramGalleryProps {
  programs: Program[]
}

export function ProgramGallery({ programs: initialPrograms }: ProgramGalleryProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter programs according to criteria
  const filteredPrograms = initialPrograms.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || program.type === typeFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && program.active) ||
      (statusFilter === "inactive" && !program.active)

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "points":
        return <Star className="h-5 w-5" />
      case "rewards":
        return <Gift className="h-5 w-5" />
      case "tier":
        return <Users className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const handleCreateProgram = () => {
    router.push("/loyalty/create")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Club de Beneficios</h1>
          <p className="text-gray-500">Administre sus programas de lealtad activas</p>
        </div>
        <Button onClick={handleCreateProgram} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Crear Programa
        </Button>
      </div>

      {initialPrograms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Plus className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No hay programas creados</h3>
            <p className="text-gray-500 mb-4">
              Comience creando su primer programa de fidelización
            </p>
            <Button onClick={handleCreateProgram} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Programa
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar programas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="points">Puntos</SelectItem>
                <SelectItem value="rewards">Recompensas</SelectItem>
                <SelectItem value="tier">Niveles</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Link href={`/loyalty/program/${program.id}`} key={program.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{program.name}</h2>
                        <div className="flex items-center mt-2">
                          <Badge variant={program.active ? "default" : "secondary"} className="mr-2">
                            {program.active ? "Activo" : "Inactivo"}
                          </Badge>
                          <div className="flex items-center text-gray-500">
                            {getTypeIcon(program.type)}
                            <span className="ml-1">
                              {program.type === "points" ? "Puntos" :
                               program.type === "rewards" ? "Recompensas" :
                               program.type === "tier" ? "Niveles" : program.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            program.active ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      {program.users} usuarios
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
