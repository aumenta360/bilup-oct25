"use client"

import { CustomersList } from "../../../components/customers/customers-list"
import { getCustomers } from "../../../services/customers-service"
import { useEffect, useState } from "react"
import type { Customer } from "@/types/customer"

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  return <CustomersList customers={customers} />
}

export default CustomersPage
