"use client"

import { loyaltyService } from "@/services/loyalty-service"
import { notFound } from "next/navigation"
import { SummaryProgram } from "@/components/loyalty/program/summary"
import { useEffect, useState } from "react"
import type { Program } from "@/types/loyalty"

const ProgramPage = ({ params }: { params: { id: string } }) => {
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const data = await loyaltyService.getProgramById(Number(params.id))
        if (!data) {
          notFound()
        }
        setProgram(data)
      } catch (error) {
        console.error('Error fetching program:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgram()
  }, [params.id])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  if (!program) {
    notFound()
  }

  return <SummaryProgram program={program} />
}

export default ProgramPage
