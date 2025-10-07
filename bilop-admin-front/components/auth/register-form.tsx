"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Toast } from "../../components/ui/toast"
import { authService } from "../../services/auth.service"

interface FormData {
  nombre: string
  apellido: string
  email: string
  password: string
  confirmPassword: string
  empresa: string
}

interface FormErrors {
  nombre?: string
  apellido?: string
  email?: string
  password?: string
  confirmPassword?: string
  empresa?: string
}

const RegisterForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    empresa: "",
  })
  
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (formData.nombre.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres."
    }
    
    if (formData.apellido.length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres."
    }
    
    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido."
    }
    
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres."
    }
    
    if (formData.confirmPassword.length < 6) {
      newErrors.confirmPassword = "La confirmación de contraseña debe tener al menos 6 caracteres."
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }
    
    if (formData.empresa.length < 2) {
      newErrors.empresa = "El nombre de la empresa debe tener al menos 2 caracteres."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await authService.register({
        name: formData.nombre,
        lastName: formData.apellido,
        email: formData.email,
        password: formData.password,
        company: formData.empresa,
      })
      Toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión.",
        open: true,
        onOpenChange: () => {},
      })
      router.push("/login")
    } catch (error: any) {
      let errorMessage = "Ha ocurrido un error. Intenta nuevamente."
      
      // Manejar errores específicos del servidor
      if (error.message) {
        switch (error.message.toLowerCase()) {
          case "email already exists":
            errorMessage = "Este correo electrónico ya está registrado."
            break
          case "invalid email format":
            errorMessage = "El formato del correo electrónico no es válido."
            break
          case "password too weak":
            errorMessage = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
            break
          default:
            errorMessage = error.message
        }
      }
      
      Toast({
        title: "Error en el registro",
        description: errorMessage,
        open: true,
        onOpenChange: () => {},
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input
            name="nombre"
            placeholder="Juan"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errors.nombre && (
            <span className="text-sm text-red-500">{errors.nombre}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <Input
            name="apellido"
            placeholder="Pérez"
            value={formData.apellido}
            onChange={handleChange}
          />
          {errors.apellido && (
            <span className="text-sm text-red-500">{errors.apellido}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <Input
          name="email"
          type="email"
          placeholder="tu@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Empresa</label>
        <Input
          name="empresa"
          placeholder="Mi Empresa S.A."
          value={formData.empresa}
          onChange={handleChange}
        />
        {errors.empresa && (
          <span className="text-sm text-red-500">{errors.empresa}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <span className="text-sm text-red-500">{errors.confirmPassword}</span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </Button>
    </form>
  )
}

export default RegisterForm
