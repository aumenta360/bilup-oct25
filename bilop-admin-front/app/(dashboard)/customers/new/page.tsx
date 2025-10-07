"use client"

import { NewCustomer } from "../../../../components/customers/new-customer"
import { loyaltyService } from "../../../../services/loyalty-service"
import { useEffect, useState } from "react"
import type { Program } from "@/types/loyalty"

const NewCustomerPage = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await loyaltyService.getPrograms()
        setPrograms(data)
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  return <NewCustomer programs={programs} />
}

export default NewCustomerPage
