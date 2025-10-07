"use client"

import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Download, BarChart, LineChart, PieChart, Users, CreditCard, TrendingUp } from "lucide-react"
import { useState } from "react"
import type { Analytics, Program, DistributionItem, CustomerActivity } from "../../types/analytics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

interface AnalyticsProps {
  data: Analytics
}

const Analytics = ({ data }: AnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [selectedProgram, setSelectedProgram] = useState("all")

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Analyze the performance of your loyalty programs</p>
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
            </SelectContent>
          </Select>

          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {data.programs?.map((program: Program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Clients</h3>
            <p className="text-3xl font-bold">{data.totalCustomers}</p>
            <p className="text-sm text-green-500">+{data.newCustomers} new clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold">{data.totalSales}</p>
            <p className="text-sm text-green-500">+{data.salesGrowth}% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Redeemed Rewards</h3>
            <p className="text-3xl font-bold">{data.redeemedPoints}</p>
            <p className="text-sm text-green-500">Value: ${data.rewardsValue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Redemption Rate</h3>
            <p className="text-3xl font-bold">{data.conversionRate}%</p>
            <p className="text-sm text-green-500">+{data.retentionRate}% vs last period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Program Distribution</h3>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <PieChart className="h-12 w-12 text-gray-400" />
              </div>
            </TabsContent>

            <TabsContent value="table">
              <div className="border rounded-md">
                <div className="grid grid-cols-3 border-b p-3 bg-gray-50 dark:bg-gray-900">
                  <div className="font-medium">Program</div>
                  <div className="font-medium">Clients</div>
                  <div className="font-medium">% of total</div>
                </div>
                {data.programDistribution?.map((item: DistributionItem, index: number) => (
                  <div key={index} className="grid grid-cols-3 border-b p-3 last:border-0">
                    <div>{item.name}</div>
                    <div>{item.customers}</div>
                    <div>{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Client Activity</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-3 border-b p-3 bg-gray-50 dark:bg-gray-900">
              <div className="font-medium">Date</div>
              <div className="font-medium">Clients</div>
              <div className="font-medium">Transactions</div>
            </div>
            {data.customerActivity?.map((item: CustomerActivity, index: number) => (
              <div key={index} className="grid grid-cols-3 border-b p-3 last:border-0">
                <div>{item.date}</div>
                <div>{item.customers}</div>
                <div>{item.sales}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics
