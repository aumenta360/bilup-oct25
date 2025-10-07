"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { BarChart, LineChart, PieChart, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { SalesReport, SalesByCategory } from "../../types/sale"

interface SalesReportsProps {
  report: SalesReport
}

export function SalesReports({ report }: SalesReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [reportType, setReportType] = useState("sales")

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/sales">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Sales Reports</h1>
            <p className="text-gray-500 dark:text-gray-400">Analyze sales performance with detailed reports</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="mb-6">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="sales" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <LineChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <PieChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <LineChart className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="products" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Top products by sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top products by quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Best selling products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 p-3 bg-gray-50 dark:bg-gray-900 font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Sales</div>
                <div className="col-span-2 text-right">% of total</div>
              </div>

              <div className="divide-y">
                {report.salesByBranch.map((item: SalesByCategory, index: number) => (
                  <div key={index} className="grid grid-cols-12 p-3 items-center">
                    <div className="col-span-1 font-medium">{index + 1}</div>
                    <div className="col-span-5">
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div className="col-span-2 text-center">{item.value}</div>
                    <div className="col-span-2 text-center">${item.value.toLocaleString()}</div>
                    <div className="col-span-2 text-right">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <PieChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <LineChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="branches" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <PieChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branch comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="customers" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top customers by purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <LineChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  )
}
