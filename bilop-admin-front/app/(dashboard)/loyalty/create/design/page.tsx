"use client"

import CardDesignForm from "../../../../../components/loyalty/create/card-design-form"
import { useRouter } from "next/navigation"

const DesignPage = () => {
  const router = useRouter()

  const handleNext = () => {
    router.push("/loyalty/create/rules")
  }

  const handlePrevious = () => {
    router.push("/loyalty/create/basic-data")
  }

  return <CardDesignForm onNext={handleNext} onPrevious={handlePrevious} />
}

export default DesignPage
