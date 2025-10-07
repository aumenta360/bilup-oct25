"use client"

import BasicDataForm from "../../../../../components/loyalty/create/basic-data-form"
import { useRouter } from "next/navigation"

const BasicDataPage = () => {
  const router = useRouter()

  const handleNext = () => {
    router.push("/loyalty/create/design")
  }

  const handlePrevious = () => {
    router.push("/loyalty/create/format")
  }

  return <BasicDataForm onNext={handleNext} onPrevious={handlePrevious} />
}

export default BasicDataPage
