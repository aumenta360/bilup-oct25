"use client"

import { SalesReports } from "../../../../components/sales/sales-reports"
import { salesService } from "../../../../services/sales-service"
import { useEffect, useState } from "react"
import type { SalesReport } from "../../../../types/sale"

const SalesReportsPage = () => {
  const [report, setReport] = useState<SalesReport | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      const data = await salesService.getSalesReport("2023-01-01")
      setReport(data)
    }
    loadReport()
  }, [])

  if (!report) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <p className="text-gray-500 dark:text-gray-400">Loading report data...</p>
      </div>
    )
  }

  return <SalesReports report={report} />
}

export default SalesReportsPage;
