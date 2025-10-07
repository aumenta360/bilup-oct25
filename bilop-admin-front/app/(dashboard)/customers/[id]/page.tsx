"use client"

import { CustomerProfile } from "../../../../components/customers/customer-profile"
import { getCustomer } from "../../../../services/customers-service"
import { getSalesByCustomer } from "../../../../services/sales-service"
import { loyaltyService } from "../../../../services/loyalty-service"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import type { Program } from "@/types/loyalty"
import type { Customer } from "@/types/customer"
import type { Sale } from "@/types/sale"


const ClientProfilePage = ({ params }: { params: { id: string } }) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [sales, setSales] = useState<Sale[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerData, salesData, programsData] = await Promise.all([
          getCustomer(params.id),
          getSalesByCustomer(params.id),
          loyaltyService.getPrograms()
        ])

        if (!customerData) {
          notFound()
        }

        setCustomer(customerData)
        setSales(salesData)
        setPrograms(programsData)
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

  if (!customer) {
    notFound()
  }

  return <CustomerProfile customer={customer} sales={sales} programs={programs as any} />
}

export default ClientProfilePage;
