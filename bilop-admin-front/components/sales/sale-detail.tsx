"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import type { Sale } from "../../types/sale"

interface SaleDetailsProps {
  sale: Sale
}

export function SaleDetails({ sale }: SaleDetailsProps) {
  // Get badge color based on status
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

  // Get status text
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 mr-2" />
      case "pending":
        return <Clock className="h-5 w-5 mr-2" />
      case "cancelled":
        return <XCircle className="h-5 w-5 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/sales/history">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Sale #{sale.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadgeVariant(sale.status) as any} className="flex items-center">
                {getStatusIcon(sale.status)}
                {getStatusText(sale.status)}
              </Badge>
              <span className="text-gray-500 dark:text-gray-400">{new Date(sale.date).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">{sale.customerName}</p>
                  <p className="text-sm text-gray-500">ID: {sale.customerId}</p>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t">
                <Link href={`/customers/${sale.customerId}`}>
                  <Button variant="outline" className="w-full">
                    View full profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sale Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">Branch</p>
                  <p className="text-sm text-gray-500">{sale.branchName}</p>
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-gray-500">
                    {sale.paymentMethod === "cash" && "Cash"}
                    {sale.paymentMethod === "card" && "Credit/Debit Card"}
                    {sale.paymentMethod === "transfer" && "Bank Transfer"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>${sale.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxes:</span>
                <span>${sale.taxes.toLocaleString()}</span>
              </div>
              {sale.discounts > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount:</span>
                  <span className="text-green-500">-${sale.discounts.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${sale.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 p-3 bg-gray-50 dark:bg-gray-900 font-medium">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            <div className="divide-y">
              {sale.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 p-3 items-center">
                  <div className="col-span-5">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">ID: {item.productId}</p>
                  </div>
                  <div className="col-span-2 text-center">${item.unitPrice.toLocaleString()}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-3 text-right font-medium">
                    ${item.subtotal.toLocaleString()}
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
