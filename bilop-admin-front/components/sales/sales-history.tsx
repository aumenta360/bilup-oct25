"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Search, FileDown, Eye } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import type { Sale } from "../../types/sale"
import Link from "next/link"

interface SalesHistoryProps {
  sales: Sale[]
}

export default function SalesHistory({ sales: initialSales }: SalesHistoryProps) {
  const { toast } = useToast()
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [filteredSales, setFilteredSales] = useState<Sale[]>(initialSales)
  const [search, setSearch] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    applyFilters()
  }, [search, dateFilter, sales])

  const applyFilters = () => {
    let result = [...sales]

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase()
      result = result.filter(
        (sale) =>
          sale.id.toLowerCase().includes(searchTerm) ||
          sale.customerName.toLowerCase().includes(searchTerm)
      )
    }

    // Date filter
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    switch (dateFilter) {
      case "today":
        result = result.filter((sale) => new Date(sale.date) >= startOfToday)
        break
      case "week":
        result = result.filter((sale) => new Date(sale.date) >= startOfWeek)
        break
      case "month":
        result = result.filter((sale) => new Date(sale.date) >= startOfMonth)
        break
      default:
        break
    }

    setFilteredSales(result)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "pending":
        return "Pending"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const exportToCSV = () => {
    // TODO: Implement CSV export
    toast({
      title: "Export",
      description: "CSV export functionality will be implemented soon.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales History</h2>
          <p className="text-muted-foreground">View and manage sales history</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/sales/new">
            <Button>New Sale</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter sales history according to your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>{filteredSales.length} sales found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell className="text-right">${sale.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {sale.paymentMethod === "cash" && "Cash"}
                      {sale.paymentMethod === "card" && "Credit/Debit Card"}
                      {sale.paymentMethod === "transfer" && "Bank Transfer"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(sale.status) as any}>
                        {getStatusText(sale.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/sales/${sale.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
