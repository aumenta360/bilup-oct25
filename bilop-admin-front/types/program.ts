export interface Program {
  id: string
  name: string
  type: "points" | "rewards" | "tier"
  active: boolean
  users: number
  description?: string
  startDate?: string
  endDate?: string
  creationDate: string
  statistics: {
    totalPoints: number
    redeemedPoints: number
    activeUsers: number
    averagePointsPerUser: number
  }
  basicData: {
    description: string
    validityPeriod: number
    minimumPoints: number
    maximumPoints: number
    branches: string[]
  }
  design: {
    primaryColor: string
    secondaryColor: string
    logo: string
    stampImage: string
  }
  rules: {
    stamps: {
      pointsPerPurchase: number
      requiredStamps: number
      reward: string
    }
    prepaid: {
      minimumAmount: number
      maximumAmount: number
      bonusPercentage: number
    }
    levels: {
      levels: {
        name: string
        requiredPoints: number
        benefits: string[]
      }[]
    }
  }
}

