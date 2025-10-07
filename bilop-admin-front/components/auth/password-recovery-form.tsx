"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Toast } from "../../components/ui/toast"
import { authService } from "../../services/auth.service"

const RecuperarContrasenaForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Por favor ingresa un correo electrónico.")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido.")
      return
    }

    setIsLoading(true)
    try {
      // La función de recuperación de contraseña no está implementada en authService real
      Toast({
        title: "La recuperación de contraseña no está disponible en este entorno.",
        open: true,
        onOpenChange: () => {},
      });
      // Si implementas recoverPassword en authService, aquí puedes llamarla
    } catch (error) {
      Toast({
        title: "Ha ocurrido un error. Intenta nuevamente.",
        open: true,
        onOpenChange: () => {},
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-green-600 dark:text-green-400"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Correo enviado</h3>
        <p className="text-center text-sm text-muted-foreground">
          Hemos enviado un correo electrónico con instrucciones para recuperar tu contraseña. Por favor revisa tu
          bandeja de entrada.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setEmailSent(false)}>
          Volver a intentar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@ejemplo.com"
        />
        {error && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar instrucciones"
        )}
      </Button>
    </form>
  )
}

export default RecuperarContrasenaForm;