"use client"

import type { Program } from "@/types/program"
import CreateStampProgramV2 from "@/components/loyalty/create/CreateStampProgramV2"

export default function CreateProgramPage() {
  // Programa vacío para el modo de creación
  const emptyProgram: Program = {
    id: "",
    name: "",
    type: "points",
    active: true,
    users: 0,
    creationDate: new Date().toISOString(),
    statistics: {
      totalPoints: 0,
      redeemedPoints: 0,
      activeUsers: 0,
      averagePointsPerUser: 0
    },
    basicData: {
      description: "",
      validityPeriod: 12,
      minimumPoints: 0,
      maximumPoints: 100,
      branches: []
    },
    design: {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      logo: "/placeholder.svg",
      stampImage: "/placeholder.svg"
    },
    rules: {
      stamps: {
        pointsPerPurchase: 1,
        requiredStamps: 10,
        reward: ""
      },
      prepaid: {
        minimumAmount: 0,
        maximumAmount: 0,
        bonusPercentage: 0
      },
      levels: {
        levels: []
      }
    }
  }

  return <CreateStampProgramV2 />
} 