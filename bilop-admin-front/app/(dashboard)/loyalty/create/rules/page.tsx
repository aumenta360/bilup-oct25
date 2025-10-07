"use client"

import RulesForm from "../../../../../components/loyalty/create/stamps-config-form"
import { useCreateProgram } from "../../../../../context/create-program-context"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const RulesPage = () => {
  const { format } = useCreateProgram()
  const router = useRouter()

  // Redirect if no format is selected
  useEffect(() => {
    if (!format) {
      redirect("/loyalty/create/format")
    }
  }, [format])

  const handleNext = () => {
    router.push("/loyalty/create/conditions")
  }

  const handlePrevious = () => {
    router.push("/loyalty/create/design")
  }

  return <RulesForm onNext={handleNext} onPrevious={handlePrevious} />
}

export default RulesPage;
