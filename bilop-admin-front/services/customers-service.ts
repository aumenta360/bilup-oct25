import type { Customer } from "../types/customer"

// Mock data to simulate API
const customersMock: Customer[] = [
  {
    id: "cust-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 890",
    registrationDate: "2024-01-20T00:00:00Z",
    active: true,
    progress: 5,
    level: "Silver",
    balance: 0,
    programId: "prog-001"
  },
  {
    id: "cust-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 345 678 901",
    registrationDate: "2024-02-05T00:00:00Z",
    active: true,
    progress: 3,
    balance: 75.5,
    level: "Bronze",
    programId: "prog-001"
  },
  {
    id: "cust-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    registrationDate: "2024-02-15T00:00:00Z",
    active: false,
    progress: 2,
    balance: 0,
    level: "Bronze",
    programId: "prog-002"
  },
  {
    id: "cust-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 456 789 012",
    registrationDate: "2024-03-01T00:00:00Z",
    active: true,
    progress: 7,
    level: "Gold",
    balance: 150.0,
    programId: "prog-002"
  },
  {
    id: "cust-005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    registrationDate: "2024-03-10T00:00:00Z",
    active: true,
    progress: 1,
    balance: 25.0,
    level: "Bronze",
    programId: "prog-003"
  },
]

// Get all customers
export async function getCustomers(): Promise<Customer[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return customersMock
}

// Get customers by program
export async function getCustomersByProgram(programId: string): Promise<Customer[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return customersMock.filter(customer => customer.programId === programId)
}

// Get a customer by ID
export async function getCustomer(id: string): Promise<Customer | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return customersMock.find((c) => c.id === id) || null
}

// Create a new customer
export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newCustomer: Customer = {
    id: `cust-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone,
    registrationDate: new Date().toISOString(),
    active: data.active ?? true,
    progress: data.progress || 0,
    balance: data.balance || 0,
    level: data.level || "Bronze",
    programId: data.programId || "",
  }

  // In a real application, this would be saved to the database
  customersMock.push(newCustomer)

  return newCustomer
}

// Update an existing customer
export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = customersMock.findIndex((c) => c.id === id)
  if (index === -1) return null

  // Update customer with new data
  customersMock[index] = {
    ...customersMock[index],
    ...data,
  }

  return customersMock[index]
}

// Delete a customer
export async function deleteCustomer(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = customersMock.findIndex((c) => c.id === id)
  if (index === -1) return false

  customersMock.splice(index, 1)
  return true
}

export async function getSegments() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: "seg-001",
      name: "High Value Customers",
      description: "Customers with high purchase frequency and value",
      customers: 150,
      averageValue: 2500,
      color: "#3B82F6",
      percentage: 15
    },
    {
      id: "seg-002",
      name: "New Customers",
      description: "Customers who joined in the last 30 days",
      customers: 300,
      averageValue: 500,
      color: "#10B981",
      percentage: 30
    },
    {
      id: "seg-003",
      name: "Inactive Customers",
      description: "Customers with no purchases in the last 90 days",
      customers: 200,
      averageValue: 100,
      color: "#EF4444",
      percentage: 20
    },
    {
      id: "seg-004",
      name: "Regular Customers",
      description: "Customers with consistent purchase patterns",
      customers: 350,
      averageValue: 1200,
      color: "#F59E0B",
      percentage: 35
    }
  ]
}
