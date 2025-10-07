"use client"

import { CustomersProgram } from "@/components/loyalty/program/customers"
import { loyaltyService } from "@/services/loyalty-service"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import type { Program } from "@/types/loyalty"
import type { Customer } from "@/types/customer"

const CustomersPage = ({ params }: { params: { id: string } }) => {
  const [program, setProgram] = useState<Program | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programData, customersData] = await Promise.all([
          loyaltyService.getProgramById(Number(params.id)),
          loyaltyService.getProgramCustomers(Number(params.id))
        ])

        if (!programData) {
          notFound()
        }

        setProgram(programData)
        setCustomers(customersData)
      } catch (error) {
        console.error('Error fetching data:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  if (!program) {
    notFound()
  }

  return <CustomersProgram program={program} customers={customers} />
}

export default CustomersPage
