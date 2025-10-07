import type { Branch } from "../types/branch"

// TODO: Replace with actual API calls
export const branchesService = {
  async getBranches(): Promise<Branch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return [
      {
        id: "1",
        name: "Branch Center",
        address: "123 Main St, City Center",
        phone: "+1 234 567 890",
        email: "center@bilop.com",
        active: true,
        openingHours: {
          monday: "9:00 - 18:00",
          tuesday: "9:00 - 18:00",
          wednesday: "9:00 - 18:00",
          thursday: "9:00 - 18:00",
          friday: "9:00 - 18:00",
          saturday: "10:00 - 16:00",
          sunday: "Closed"
        },
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "Branch North",
        address: "456 North Ave, North District",
        phone: "+1 234 567 891",
        email: "north@bilop.com",
        active: true,
        openingHours: {
          monday: "9:00 - 18:00",
          tuesday: "9:00 - 18:00",
          wednesday: "9:00 - 18:00",
          thursday: "9:00 - 18:00",
          friday: "9:00 - 18:00",
          saturday: "10:00 - 16:00",
          sunday: "Closed"
        },
        coordinates: {
          latitude: 40.7829,
          longitude: -73.9654
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      }
    ]
  },

  async getBranchById(id: string): Promise<Branch | null> {
    const branches = await this.getBranches()
    return branches.find(branch => branch.id === id) || null
  },

  async createBranch(branch: Omit<Branch, "id" | "createdAt" | "updatedAt">): Promise<Branch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newBranch: Branch = {
      ...branch,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return newBranch
  },

  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const existingBranch = await this.getBranchById(id)
    if (!existingBranch) {
      throw new Error("Branch not found")
    }
    
    const updatedBranch: Branch = {
      ...existingBranch,
      ...branch,
      updatedAt: new Date().toISOString()
    }
    
    return updatedBranch
  },

  async deleteBranch(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const existingBranch = await this.getBranchById(id)
    if (!existingBranch) {
      throw new Error("Branch not found")
    }
  }
}
