"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import type { SalesSummary } from "../../types/sale"

interface SalesSummaryProps {
  summary: SalesSummary
}

const SalesSummary = ({ summary }: SalesSummaryProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  // Helper function to calculate bar height percentage
  const getBarHeight = (value: number) => {
    const maxValue = Math.max(...summary.topSellingProducts.map(p => p.revenue))
    return (value / maxValue) * 100
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor your sales performance and metrics</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.salesToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.salesWeek.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.salesMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.salesYear.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.averageTicket.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{summary.newCustomers} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.newCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.monthlyGrowth > 0 ? "+" : ""}{summary.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              Compared to last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-end justify-between gap-2 px-2">
              {summary.topSellingProducts.map((product) => (
                <div key={product.id} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full bg-primary/80 rounded-t-sm transition-all duration-300 hover:bg-primary"
                    style={{ height: `${getBarHeight(product.revenue)}%` }}
                  />
                  <span className="text-xs text-muted-foreground rotate-45 origin-left truncate max-w-[120px]">
                    {product.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {summary.topSellingProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity} units - ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">${product.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default SalesSummary

