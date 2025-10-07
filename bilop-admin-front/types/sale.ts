export interface Sale {
  id: string
  date: string
  customerId: string
  customerName: string
  branchId: string
  branchName: string
  sellerId: string
  sellerName: string
  items: SaleItem[]
  subtotal: number
  taxes: number
  discounts: number
  total: number
  paymentMethod: string
  status: SaleStatus
  loyaltyProgramApplied?: string
  pointsApplied?: number
  pointsGenerated?: number
  notes?: string
  invoiceIssued: boolean
  invoiceNumber?: string
}

export interface SaleItem {
  id: string
  productId: string
  name: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
  taxes: number
  total: number
}

export type SaleStatus = "completed" | "pending" | "cancelled" | "returned"

export interface SalesSummary {
  salesToday: number
  salesWeek: number
  salesMonth: number
  salesYear: number
  monthlyGrowth: number
  averageTicket: number
  totalCustomers: number
  newCustomers: number
  topSellingProducts: SoldProduct[]
}

export interface SoldProduct {
  id: string
  name: string
  quantity: number
  revenue: number
}

export interface SaleFilters {
  startDate?: string
  endDate?: string
  customerId?: string
  branchId?: string
  sellerId?: string
  status?: SaleStatus
  paymentMethod?: string
  minTotal?: number
  maxTotal?: number
  loyaltyProgram?: string
}

export interface SalesReport {
  period: string
  totalSales: number
  transactions: number
  averageTicket: number
  salesByBranch: SalesByCategory[]
  salesByPaymentMethod: SalesByCategory[]
  salesBySeller: SalesByCategory[]
  salesByHour: SalesByHour[]
  salesByDay: SalesByDay[]
}

export interface SalesByCategory {
  name: string
  value: number
  percentage: number
}

export interface SalesByHour {
  hour: number
  value: number
}

export interface SalesByDay {
  day: string
  value: number
}
