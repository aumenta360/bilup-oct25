import type { Metadata } from "next"
import Link from "next/link"
import RegisterForm from "../../../components/auth/register-form"

export const metadata: Metadata = {
  title: "Registro | BILUP - Sistema de Fidelización",
  description: "Crea una cuenta en BILOP",
}

const RegisterPage = () => {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link href="/login" className="absolute right-4 top-4 md:right-8 md:top-8">
        Iniciar sesión
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-indigo-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          BILOP
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Únete a miles de negocios que ya están transformando su relación con los clientes a través de BILOP."
            </p>
            <footer className="text-sm">Carlos Rodríguez - Director de Marketing en TechRetail</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h1>
            <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte en la plataforma</p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al registrarte, aceptas nuestros{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Términos de servicio
            </a>{" "}
            y{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;
