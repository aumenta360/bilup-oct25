import type { Analytics } from "../types/analytics"

// Mock data for analytics
const analyticsMock: Analytics = {
  // Customer metrics
  totalCustomers: 530,
  newCustomers: 42,
  activeCustomers: 450,
  customerGrowth: 42,

  // Points and rewards metrics
  totalPoints: 12500,
  redeemedPoints: 8500,
  pointsGrowth: 15,
  rewardsValue: 4250,

  // Transaction metrics
  totalSales: 12500,
  salesGrowth: 15,
  averageTicket: 25.5,
  averageTransaction: 23.5,
  ticketGrowth: 8,

  // Program metrics
  conversionRate: 75,
  retentionRate: 85,

  // Detailed data
  customerData: {
    total: 530,
    new: 42,
    active: 450,
    inactive: 80
  },
  salesData: {
    total: 12500,
    withProgram: 8500,
    withoutProgram: 4000
  },
  programs: [
    { id: "prog-001", name: "Coffee Lovers Club", customers: 245, averageValue: 10, color: "#FFD700", percentage: 46 },
    { id: "prog-002", name: "Premium Prepaid Card", customers: 187, averageValue: 10, color: "#FFD700", percentage: 35 },
    { id: "prog-003", name: "VIP Levels Club", customers: 98, averageValue: 10, color: "#FFD700", percentage: 19 }
  ],
  customerActivity: [
    { date: "2024-03-01", customers: 120, sales: 3000 },
    { date: "2024-03-02", customers: 145, sales: 3625 },
    { date: "2024-03-03", customers: 130, sales: 3250 }
  ],
  programDistribution: [
    { name: "Coffee Lovers Club", customers: 245, percentage: 46 },
    { name: "Premium Prepaid Card", customers: 187, percentage: 35 },
    { name: "VIP Levels Club", customers: 98, percentage: 19 }
  ],
  branchPerformance: [
    { name: "Branch Center", customers: 210, transactions: 780, rewards: 52 },
    { name: "Branch North", customers: 175, transactions: 645, rewards: 38 },
    { name: "Branch South", customers: 145, transactions: 450, rewards: 34 }
  ]
}

// Get analytics data filtered by program
export async function getAnalyticsByProgram(programId: string): Promise<Analytics> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real application, data would be filtered by program
  return {
    ...analyticsMock,
    totalCustomers: Math.floor(analyticsMock.totalCustomers * 0.4),
    newCustomers: Math.floor(analyticsMock.newCustomers * 0.4),
    activeCustomers: Math.floor(analyticsMock.activeCustomers * 0.4),
    customerGrowth: Math.floor(analyticsMock.customerGrowth * 0.4),
    totalPoints: Math.floor(analyticsMock.totalPoints * 0.4),
    redeemedPoints: Math.floor(analyticsMock.redeemedPoints * 0.4),
    pointsGrowth: Math.floor(analyticsMock.pointsGrowth * 0.4),
    rewardsValue: Math.floor(analyticsMock.rewardsValue * 0.4),
    totalSales: Math.floor(analyticsMock.totalSales * 0.4),
    salesGrowth: Math.floor(analyticsMock.salesGrowth * 0.4),
    averageTicket: Math.floor(analyticsMock.averageTicket * 0.4),
    averageTransaction: Math.floor(analyticsMock.averageTransaction * 0.4),
    ticketGrowth: Math.floor(analyticsMock.ticketGrowth * 0.4),
    conversionRate: Math.floor(analyticsMock.conversionRate * 0.4),
    retentionRate: Math.floor(analyticsMock.retentionRate * 0.4),
    customerData: {
      total: Math.floor(analyticsMock.customerData.total * 0.4),
      new: Math.floor(analyticsMock.customerData.new * 0.4),
      active: Math.floor(analyticsMock.customerData.active * 0.4),
      inactive: Math.floor(analyticsMock.customerData.inactive * 0.4)
    },
    salesData: {
      total: Math.floor(analyticsMock.salesData.total * 0.4),
      withProgram: Math.floor(analyticsMock.salesData.withProgram * 0.4),
      withoutProgram: Math.floor(analyticsMock.salesData.withoutProgram * 0.4)
    }
  }
}

// Get all analytics data
export async function getAnalytics(): Promise<Analytics> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return analyticsMock
}
