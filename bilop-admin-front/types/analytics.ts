export interface Program {
  id: string
  name: string
  customers: number
  averageValue: number
  color: string
  percentage: number
}

export interface DistributionItem {
  name: string
  customers: number
  percentage: number
}

export interface CustomerActivity {
  date: string
  customers: number
  sales: number
}

export interface BranchPerformance {
  name: string
  customers: number
  transactions: number
  rewards: number
}

export interface CustomerData {
  total: number
  new: number
  active: number
  inactive: number
}

export interface SalesData {
  total: number
  withProgram: number
  withoutProgram: number
}

export interface Analytics {
  // Customer metrics
  totalCustomers: number
  newCustomers: number
  activeCustomers: number
  customerGrowth: number

  // Points and rewards metrics
  totalPoints: number
  redeemedPoints: number
  pointsGrowth: number
  rewardsValue: number

  // Transaction metrics
  totalSales: number
  salesGrowth: number
  averageTicket: number
  averageTransaction: number
  ticketGrowth: number

  // Program metrics
  conversionRate: number
  retentionRate: number

  // Detailed data
  customerData: CustomerData
  salesData: SalesData
  programs: Program[]
  customerActivity: CustomerActivity[]
  programDistribution: DistributionItem[]
  branchPerformance: BranchPerformance[]
}
