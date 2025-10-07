"use client"

import { CustomerSegments } from "../../../../components/customers/customer-segments"
import { getSegments } from "../../../../services/customers-service"
import { useEffect, useState } from "react"
import type { Segment } from "@/types/customer"

const CustomerSegmentsPage = () => {
  const [segments, setSegments] = useState<Segment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const data = await getSegments()
        setSegments(data)
      } catch (error) {
        console.error('Error fetching segments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSegments()
  }, [])

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  return <CustomerSegments segments={segments} />
}

export default CustomerSegmentsPage
