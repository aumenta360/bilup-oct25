"use client"

import ConditionsForm from "../../../../../components/loyalty/create/terms-condition-form"
import { useCreateProgram } from "../../../../../context/create-program-context"
import { useRouter } from "next/navigation"

const ConditionsPage = () => {
  const router = useRouter()
  const { resetForm } = useCreateProgram()

  const handlePrevious = () => {
    router.push("/loyalty/create/rules")
  }

  const handleSubmit = async (programData: any) => {
    resetForm()
    router.push("/loyalty")
  }

  return (
    <ConditionsForm 
      value={""}
      onChange={() => {}}
    />
  )
}

export default ConditionsPage;
