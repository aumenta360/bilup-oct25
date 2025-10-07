import type { Sale, SalesSummary, SalesReport } from "../types/sale"

// Mock data to simulate API
const salesMock: Sale[] = [
  {
    id: "1",
    date: "2023-05-01T10:30:00Z",
    customerId: "101",
    customerName: "Mary Gonzalez",
    branchId: "1",
    branchName: "Branch Center",
    sellerId: "201",
    sellerName: "John Perez",
    items: [
      {
        id: "1001",
        productId: "501",
        name: "Smartphone XYZ",
        quantity: 1,
        unitPrice: 12000,
        discount: 0,
        subtotal: 12000,
        taxes: 1920,
        total: 13920,
      },
    ],
    subtotal: 12000,
    taxes: 1920,
    discounts: 0,
    total: 13920,
    paymentMethod: "card",
    status: "completed",
    loyaltyProgramApplied: "Premium Program",
    pointsGenerated: 139,
    invoiceIssued: true,
    invoiceNumber: "F-2023-0001",
  },
  {
    id: "2",
    date: "2023-05-02T15:45:00Z",
    customerId: "102",
    customerName: "Charles Rodriguez",
    branchId: "2",
    branchName: "Branch North",
    sellerId: "202",
    sellerName: "Ann Lopez",
    items: [
      {
        id: "1002",
        productId: "502",
        name: "Laptop ABC",
        quantity: 1,
        unitPrice: 18000,
        discount: 1800,
        subtotal: 16200,
        taxes: 2592,
        total: 18792,
      },
      {
        id: "1003",
        productId: "503",
        name: "Wireless Mouse",
        quantity: 1,
        unitPrice: 500,
        discount: 0,
        subtotal: 500,
        taxes: 80,
        total: 580,
      },
    ],
    subtotal: 18500,
    taxes: 2672,
    discounts: 1800,
    total: 19372,
    paymentMethod: "cash",
    status: "completed",
    loyaltyProgramApplied: "Standard Program",
    pointsGenerated: 194,
    invoiceIssued: true,
    invoiceNumber: "F-2023-0002",
  },
  {
    id: "3",
    date: "2023-05-03T09:15:00Z",
    customerId: "103",
    customerName: "Laura Martinez",
    branchId: "1",
    branchName: "Branch Center",
    sellerId: "201",
    sellerName: "John Perez",
    items: [
      {
        id: "1004",
        productId: "504",
        name: "Bluetooth Headphones",
        quantity: 2,
        unitPrice: 1200,
        discount: 0,
        subtotal: 2400,
        taxes: 384,
        total: 2784,
      },
    ],
    subtotal: 2400,
    taxes: 384,
    discounts: 0,
    total: 2784,
    paymentMethod: "card",
    status: "completed",
    loyaltyProgramApplied: "Standard Program",
    pointsGenerated: 28,
    invoiceIssued: true,
    invoiceNumber: "F-2023-0003",
  },
  {
    id: "4",
    date: "2023-05-04T14:20:00Z",
    customerId: "104",
    customerName: "Robert Sanchez",
    branchId: "3",
    branchName: "Branch South",
    sellerId: "203",
    sellerName: "Patricia Gomez",
    items: [
      {
        id: "1005",
        productId: "505",
        name: 'Tablet 10"',
        quantity: 1,
        unitPrice: 8000,
        discount: 800,
        subtotal: 7200,
        taxes: 1152,
        total: 8352,
      },
    ],
    subtotal: 8000,
    taxes: 1152,
    discounts: 800,
    total: 8352,
    paymentMethod: "transfer",
    status: "completed",
    loyaltyProgramApplied: "Premium Program",
    pointsApplied: 100,
    pointsGenerated: 84,
    invoiceIssued: true,
    invoiceNumber: "F-2023-0004",
  },
  {
    id: "5",
    date: "2023-05-05T11:10:00Z",
    customerId: "105",
    customerName: "Sophia Hernandez",
    branchId: "2",
    branchName: "Branch North",
    sellerId: "202",
    sellerName: "Ann Lopez",
    items: [
      {
        id: "1006",
        productId: "506",
        name: "Multifunction Printer",
        quantity: 1,
        unitPrice: 4500,
        discount: 0,
        subtotal: 4500,
        taxes: 720,
        total: 5220,
      },
    ],
    subtotal: 4500,
    taxes: 720,
    discounts: 0,
    total: 5220,
    paymentMethod: "card",
    status: "pending",
    notes: "Pending delivery",
    invoiceIssued: false,
  },
]

const salesSummaryMock: SalesSummary = {
  salesToday: 15000,
  salesWeek: 85000,
  salesMonth: 350000,
  salesYear: 4200000,
  monthlyGrowth: 8.5,
  averageTicket: 3500,
  totalCustomers: 120,
  newCustomers: 15,
  topSellingProducts: [
    { id: "501", name: "Smartphone XYZ", quantity: 25, revenue: 348000 },
    { id: "502", name: "Laptop ABC", quantity: 12, revenue: 225504 },
    { id: "504", name: "Bluetooth Headphones", quantity: 30, revenue: 83520 },
    { id: "505", name: 'Tablet 10"', quantity: 18, revenue: 150336 },
    { id: "506", name: "Multifunction Printer", quantity: 10, revenue: 52200 },
  ],
}

const salesReportMock: SalesReport = {
  period: "May 2023",
  totalSales: 350000,
  transactions: 100,
  averageTicket: 3500,
  salesByBranch: [
    { name: "Branch Center", value: 150000, percentage: 42.86 },
    { name: "Branch North", value: 120000, percentage: 34.29 },
    { name: "Branch South", value: 80000, percentage: 22.85 },
  ],
  salesByPaymentMethod: [
    { name: "Card", value: 200000, percentage: 57.14 },
    { name: "Cash", value: 100000, percentage: 28.57 },
    { name: "Transfer", value: 50000, percentage: 14.29 },
  ],
  salesBySeller: [
    { name: "John Perez", value: 120000, percentage: 34.29 },
    { name: "Ann Lopez", value: 110000, percentage: 31.43 },
    { name: "Patricia Gomez", value: 80000, percentage: 22.86 },
    { name: "Others", value: 40000, percentage: 11.42 },
  ],
  salesByHour: [
    { hour: 9, value: 30000 },
    { hour: 10, value: 35000 },
    { hour: 11, value: 40000 },
    { hour: 12, value: 45000 },
    { hour: 13, value: 30000 },
    { hour: 14, value: 25000 },
    { hour: 15, value: 35000 },
    { hour: 16, value: 40000 },
    { hour: 17, value: 45000 },
    { hour: 18, value: 25000 },
  ],
  salesByDay: [
    { day: "Monday", value: 60000 },
    { day: "Tuesday", value: 55000 },
    { day: "Wednesday", value: 50000 },
    { day: "Thursday", value: 65000 },
    { day: "Friday", value: 70000 },
    { day: "Saturday", value: 40000 },
    { day: "Sunday", value: 10000 },
  ],
}

interface SalesStatistics {
  todaySales: number
  weekSales: number
  monthSales: number
  averageTicket: number
  customerCount: number
  salesByDay: { date: string; sales: number }[]
  salesByPaymentMethod: { method: string; total: number }[]
}

// Mock data for sales statistics
const mockSalesStatistics: SalesStatistics = {
  todaySales: 1250,
  weekSales: 8750,
  monthSales: 32500,
  averageTicket: 45.50,
  customerCount: 192,
  salesByDay: [
    { date: "Mon", sales: 1200 },
    { date: "Tue", sales: 1350 },
    { date: "Wed", sales: 1100 },
    { date: "Thu", sales: 1450 },
    { date: "Fri", sales: 1600 },
    { date: "Sat", sales: 1800 },
    { date: "Sun", sales: 1250 }
  ],
  salesByPaymentMethod: [
    { method: "Cash", total: 3500 },
    { method: "Credit Card", total: 4000 },
    { method: "Debit Card", total: 1000 },
    { method: "Mobile Payment", total: 250 }
  ]
}

// Sales service
export const salesService = {
  // Get all sales
  async getSales(): Promise<Sale[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return salesMock
  },

  // Get a sale by ID
  async getSale(id: string): Promise<Sale | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return salesMock.find((s) => s.id === id) || null
  },

  // Create a new sale
  async createSale(sale: Omit<Sale, "id">): Promise<Sale> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const newSale: Sale = {
      ...sale,
      id: (salesMock.length + 1).toString(),
      invoiceNumber: sale.invoiceIssued ? `F-2023-${String(salesMock.length + 1).padStart(4, "0")}` : undefined,
    }
    
    salesMock.push(newSale)
    return newSale
  },

  // Update an existing sale
  async updateSale(id: string, sale: Partial<Sale>): Promise<Sale | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const index = salesMock.findIndex((s) => s.id === id)
    if (index === -1) return null
    
    const updatedSale = {
      ...salesMock[index],
      ...sale,
      invoiceNumber:
        sale.invoiceIssued && !salesMock[index].invoiceIssued
          ? `F-2023-${String(index + 1).padStart(4, "0")}`
          : salesMock[index].invoiceNumber,
    }
    
    salesMock[index] = updatedSale
    return updatedSale
  },

  // Cancel a sale
  async deleteSale(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const index = salesMock.findIndex((s) => s.id === id)
    if (index === -1) return false
    
    salesMock.splice(index, 1)
    return true
  },

  // Get sales summary
  async getSalesSummary(): Promise<SalesSummary> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700))
    return salesSummaryMock
  },

  // Get sales report
  async getSalesReport(period: string): Promise<SalesReport> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 900))

    // In a real environment, this would send the request to the backend with the period
    // We simulate returning the same report
    return {
      ...salesReportMock,
      period,
    }
  },

  // Get sales statistics
  async getSalesStatistics(): Promise<SalesStatistics> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockSalesStatistics
  },
}

export const getSalesByCustomer = async (customerId: string): Promise<Sale[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return salesMock.filter((sale) => sale.customerId === customerId)
}

