"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import {
  Search,
  Download,
  UserPlus,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Mail,
  Phone,
  Award,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import type { Customer } from "../../../types/customer"
import type { Program } from "../../../types/program"

interface ProgramCustomersListProps {
  program: Program
  customers: Customer[]
}

export function ProgramCustomersList({ program, customers: initialCustomers }: ProgramCustomersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter customers based on criteria
  const customersFiltered = initialCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLevel = levelFilter === "all" || customer.level === levelFilter

    return matchesSearch && matchesLevel
  })

  // Sort customers
  const customersOrdered = [...customersFiltered].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "registrationDate":
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
        break
      case "level":
        comparison = a.level.localeCompare(b.level)
        break
      case "balance":
        comparison = a.balance - b.balance
        break
      default:
        comparison = 0
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Render sort icon
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Clientes de {program.name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar cliente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="Bronze">Bronce</SelectItem>
                  <SelectItem value="Silver">Plata</SelectItem>
                  <SelectItem value="Gold">Oro</SelectItem>
                  <SelectItem value="Platinum">Platino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <button className="flex items-center font-medium" onClick={() => handleSort("name")}>
                      Cliente {renderSortIcon("name")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center font-medium" onClick={() => handleSort("registrationDate")}>
                      Registro {renderSortIcon("registrationDate")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center font-medium" onClick={() => handleSort("level")}>
                      Nivel {renderSortIcon("level")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center font-medium" onClick={() => handleSort("balance")}>
                      Saldo {renderSortIcon("balance")}
                    </button>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersOrdered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No se encontraron clientes que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  customersOrdered.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                          {customer.phone && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          {formatDate(customer.registrationDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            customer.level === "Gold"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                              : customer.level === "Silver"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                                : customer.level === "Bronze"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          }
                        >
                          {customer.level === "Gold" ? "Oro" : 
                           customer.level === "Silver" ? "Plata" : 
                           customer.level === "Bronze" ? "Bronce" : 
                           customer.level === "Platinum" ? "Platino" : customer.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.balance}</TableCell>
                      <TableCell>
                        <Badge
                          variant={customer.active ? "success" : "destructive"}
                          className="capitalize"
                        >
                          {customer.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              Agregar puntos
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              Llamar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
