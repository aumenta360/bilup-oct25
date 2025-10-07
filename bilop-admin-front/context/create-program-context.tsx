"use client"

import type React from "react"
import { createContext, useContext, useState, ReactNode } from "react"


import type { 
  CreateProgramContextType, 
  BasicData, 
  Design, 
  Rules, 
  ResetConfig, 
  Reward 
} from "../types/create-program"


// Initial values
const initialBasicData: BasicData = {
  name: "",
  branches: [],
  active: true,
}

const initialDesign: Design = {
  logo: null,
  image: null,
  primaryColor: "#3B82F6", // Default blue
  textColor: "#FFFFFF", // Default white
  backgroundColor: "#FFFFFF", // Default white
  notificationIcon: undefined
}

const initialRules: Rules = {
  stamps: {
    pointsPerPurchase: 1,
    requiredStamps: 8,
    reward: "",
    preFilledStamps: 0,
    onCompleteBehavior: 'unlimited',
    customStampIcon: undefined,
    stampImage: undefined,
  },
  prepaid: {
    minimumAmount: 100,
    maximumAmount: 1000,
    bonusPercentage: 0,
  },
  levels: {
    levels: [],
  },
  usageLimits: {
    enabled: false,
    maxUses: 1,
    period: 'day',
  },
}

const initialResetConfig: ResetConfig = {
  enabled: false,
  amount: 1,
  period: 'day',
}

// Create context
const CreateProgramContext = createContext<CreateProgramContextType | undefined>(undefined)

// Context provider
export function CreateProgramProvider({ children }: { children: ReactNode }) {
  const [basicData, setBasicData] = useState<BasicData>(initialBasicData)
  const [design, setDesign] = useState<Design>(initialDesign)
  const [rules, setRules] = useState<Rules>(initialRules)
  const [conditions, setConditions] = useState<string>("")
  const [currentFormat, setCurrentFormat] = useState<"stamps">("stamps")
  const [resetConfig, setResetConfig] = useState<ResetConfig>(initialResetConfig)
  const [rewards, setRewards] = useState<Reward[]>([])

  const format = currentFormat

  const setFormat = (format: "stamps") => {
    setCurrentFormat(format)
  }

  const resetForm = () => {
    setBasicData(initialBasicData)
    setDesign(initialDesign)
    setRules(initialRules)
    setConditions("")
    setCurrentFormat("stamps")
  }

  return (
    <CreateProgramContext.Provider
      value={{
        format,
        setFormat,
        basicData,
        setBasicData,
        design,
        setDesign,
        rules,
        setRules,
        conditions,
        setConditions,
        resetForm,
        resetConfig,
        setResetConfig,
        rewards,
        setRewards,
      }}
    >
      {children}
    </CreateProgramContext.Provider>
  )
}

// Hook to use the context
export function useCreateProgram() {
  const context = useContext(CreateProgramContext)
  if (context === undefined) {
    throw new Error("useCreateProgram must be used within a CreateProgramProvider")
  }
  return context
}
