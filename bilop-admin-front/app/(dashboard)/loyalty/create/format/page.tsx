"use client"

import { useRouter } from "next/navigation"

const FormatPage = () => {
  const router = useRouter()

  const handleNext = () => {
    router.push("/loyalty/create/basic-data")
  }

}

export default FormatPage;
