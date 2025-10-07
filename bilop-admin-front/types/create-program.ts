import type { UsageLimits, UsagePeriod } from "./loyalty"

export interface StampsRules {
  pointsPerPurchase: number
  requiredStamps: number
  reward: string
  preFilledStamps?: number
  onCompleteBehavior?: 'unlimited' | 'limit' | 'reset'
  customStampIcon?: string
  stampImage?: string
}

export interface PrepaidRules {
  minimumAmount: number
  maximumAmount: number
  bonusPercentage: number
}

export interface LevelConfig {
  name: string
  requiredPoints: number
  benefits: string[]
}

export interface LevelsRules {
  levels: LevelConfig[]
}

export interface Rules {
  stamps: StampsRules
  prepaid: PrepaidRules
  levels: LevelsRules
  usageLimits: UsageLimits
}

export interface BasicData {
  name: string
  branches: string[]
  active: boolean
  description?: string
  validityPeriod?: number
  minimumPoints?: number
  maximumPoints?: number
}

export interface Design {
  logo: string | null
  image: string | null
  primaryColor: string
  textColor: string
  secondaryColor?: string
  stampImage?: string
  backgroundColor: string
  notificationIcon?: string
}

export interface ResetConfig {
  enabled: boolean;
  amount: number;
  period: string;
}

export interface Reward {
  id: number;
  title: string;
  requiredStamps: number;
  redeemDays: number;
  pushOnAchieve: boolean;
  active: boolean;
}

export interface CreateProgramContextType {
  format: "stamps"
  setFormat: (format: "stamps") => void
  basicData: BasicData
  setBasicData: (data: BasicData) => void
  design: Design
  setDesign: (design: Design) => void
  rules: Rules
  setRules: (rules: Rules | ((prevRules: Rules) => Rules)) => void
  conditions: string
  setConditions: (conditions: string) => void
  resetForm: () => void
  resetConfig: ResetConfig
  setResetConfig: (config: ResetConfig) => void
  rewards: Reward[]
  setRewards: (rewards: Reward[]) => void
}