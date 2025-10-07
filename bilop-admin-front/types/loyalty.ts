export type ProgramType = "stamps" | "prepaid" | "levels"
export type ProgramStatus = "draft" | "active" | "paused"
export type ExpirationType = "days" | "weeks" | "months" | "years"
export type UsagePeriod = "day" | "week" | "month"

export interface Level {
  name: string
  minSpend: number
  reward: string
}

export interface StampsRules {
  stampsRequired: number
  reward: string
}

export interface PrepaidRules {
  initialBalance: number
  bonusPercentage?: number
}

export interface LevelsRules {
  levels: Level[]
}

export interface TermsAndConditions {
  content: string
  lastUpdated: Date
}

export interface UsageLimits {
  enabled: boolean
  period: UsagePeriod
  maxUses: number
}

export interface ExpirationConfig {
  enabled: boolean
  type: ExpirationType
  value: number
}

export interface DeletionLog {
  deletedBy: number
  deletedAt: Date
  reason: string
}

export interface Program {
  id: number
  name: string
  description: string
  type: ProgramType
  pointsPerPurchase?: number
  requiredStamps?: number
  reward?: string
  status: ProgramStatus
  active: boolean
  
  primaryColor?: string
  textColor?: string
  secondaryColor?: string
  logoImage?: string
  backgroundImage?: string
  stampImage?: string
  customStampIcon?: string
  preFilledStamps?: number
  onCompleteBehavior?: 'unlimited' | 'limit' | 'reset'
  totalCustomers: number
  totalPoints: number
  totalRedemptions: number
  termsAndConditions?: TermsAndConditions
  usageLimits?: UsageLimits
  expirationConfig?: ExpirationConfig
  deletionLog?: DeletionLog
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface ProgramStats {
  totalCustomers: number
  totalPoints: number
  totalRedemptions: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  programId: string
  currentPoints: number
  totalPoints: number
  redemptions: number
  lastVisit: string
  level?: string
  createdAt: string
  updatedAt: string
}

export interface Redemption {
  id: string
  customerId: string
  programId: string
  points: number
  reward: string
  status: "pending" | "completed" | "cancelled"
  createdAt: string
  completedAt?: string
} 