import type React from "react"
import { CreateProgramProvider } from "@/context/create-program-context"

const steps = [
  { name: "Formato", href: "/fidelizacion/crear/formato" },
  { name: "Datos básicos", href: "/fidelizacion/crear/datos-basicos" },
  { name: "Diseño", href: "/fidelizacion/crear/diseno" },
  { name: "Reglas", href: "/fidelizacion/crear/reglas" },
  { name: "Condiciones", href: "/fidelizacion/crear/condiciones" },
]

const CreateLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { step: string }
}) => {
  // Determinar el paso actual basado en la URL
  const currentPath = "/fidelizacion/crear/" + params.step
  const currentStepIndex = steps.findIndex((step) => step.href === currentPath) || 0

  return (
    <CreateProgramProvider>
      <div className="p-6">{children}</div>
    </CreateProgramProvider>
  )
}

export default CreateLayout
