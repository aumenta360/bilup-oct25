"use client"

import { ArrowLeft, Download } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useState } from "react"
import Link from "next/link"
import type { Analytics } from "../../../types/analytics"
import type { Program } from "../../../types/program"

interface AnalyticsProgramProps {
  program: Program & {
    basicData: {
      branches: string[]
    }
  }
  analytics: Analytics
}

export function AnalyticsProgram({ program, analytics }: AnalyticsProgramProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [period, setPeriod] = useState<string>("30d")

  // Function to get chart title based on program type
  const getChartTitle = (type: string) => {
    switch (type) {
      case "points":
        return "Points issued vs. Rewards redeemed"
      case "rewards":
        return "Balance loaded vs. Transactions"
      case "tier":
        return "Customer distribution by tier"
      default:
        return "Program activity"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/loyalty/program/${program.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Program Analytics</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {program.basicData.branches.map((branchId) => (
                <SelectItem key={branchId} value={branchId}>
                  Branch {branchId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export data</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total customers</p>
                <h2 className="text-3xl font-bold">{analytics.totalCustomers}</h2>
                <p className="text-xs text-green-500 mt-1">+{analytics.newCustomers} this month</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {program.type === "points"
                    ? "Points issued"
                    : program.type === "rewards"
                      ? "Balance loaded"
                      : "Active customers"}
                </p>
                <h2 className="text-3xl font-bold">
                  {program.type === "rewards" ? `$${analytics.totalPoints}` : analytics.totalPoints}
                </h2>
                <p className="text-xs text-green-500 mt-1">+{analytics.pointsGrowth}% this month</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {program.type === "points"
                    ? "Rewards redeemed"
                    : program.type === "rewards"
                      ? "Transactions"
                      : "Conversion rate"}
                </p>
                <h2 className="text-3xl font-bold">
                  {program.type === "tier" ? `${analytics.conversionRate}%` : analytics.redeemedPoints}
                </h2>
                <p className="text-xs text-amber-500 mt-1">
                  {program.type === "points"
                    ? `Approx. value $${analytics.rewardsValue}`
                    : program.type === "rewards"
                      ? `Average $${analytics.averageTransaction}`
                      : `${analytics.retentionRate}% vs. last month`}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Simplified view - Data visualization available in premium version</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getChartTitle(program.type)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Simplified view - Data visualization available in premium version</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Most active hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Morning (8-12h)</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Afternoon (12-18h)</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Evening (18-22h)</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Most active days</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Monday-Tuesday</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Wednesday-Thursday</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Friday-Sunday</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Visit frequency</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Once per week</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>2-3 times per week</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>4+ times per week</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demographics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Age distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>18-24 years</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>25-34 years</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>35+ years</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Gender distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Female</span>
                      <span className="font-medium">55%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "55%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Male</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Not specified</span>
                      <span className="font-medium">3%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "3%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Location</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>City center</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Residential area</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Other areas</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="behavior">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average ticket</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>$0-$20</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>$21-$50</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>$51+</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preferred products</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Category A</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Category B</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Category C</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Retention rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>1 month</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>3 months</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>6 months</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
