import LoginForm from "../../../components/auth/login-form"
import Image from "next/image"

const LoginPage = () => {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
          BILUP
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "BILUP ha transformado la manera en que interactuamos con nuestros clientes. La fidelización nunca había
              sido tan sencilla y efectiva."
            </p>
            <footer className="text-sm">Juan Pérez - CEO de BILUP</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 relative">
              <Image
                src="/logo.svg"
                alt="BILOP Logo"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
              <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
            </div>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al continuar, aceptas nuestros{" "}
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

export default LoginPage;