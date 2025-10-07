"use client"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { QrCode, Copy, Facebook, Twitter, PhoneIcon as WhatsApp, Mail, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useState } from "react"
import { useToast } from "../../../hooks/use-toast"
import Link from "next/link"
import type { Program } from "../../../types/program"

interface ShareProgramProps {
  program: Program
}

export function ShareProgram({ program }: ShareProgramProps) {
  const { toast } = useToast()
  const [enlaceCopiado, setEnlaceCopiado] = useState(false)

  // URL para compartir (simulada)
  const urlCompartir = `https://app.bilopapp.com/p/${program.id}`

  // Función para copiar al portapapeles
  const copyLink = () => {
    navigator.clipboard.writeText(urlCompartir)
    setEnlaceCopiado(true)
    toast({
      title: "Enlace copiado",
      description: "El enlace ha sido copiado al portapapeles",
    })

    setTimeout(() => {
      setEnlaceCopiado(false)
    }, 3000)
  }

  // URLs para compartir en redes sociales
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlCompartir)}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlCompartir)}&text=${encodeURIComponent(`¡Únete a nuestro programa de fidelización ${program.name}!`)}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Únete a nuestro programa de fidelización ${program.name}! ${urlCompartir}`)}`
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Programa de fidelización ${program.name}`)}&body=${encodeURIComponent(`¡Únete a nuestro programa de fidelización! ${urlCompartir}`)}`

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/loyalty/program/${program.id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Compartir programa</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enlace y código QR</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="enlace">
              <TabsList className="mb-4">
                <TabsTrigger value="enlace">Enlace</TabsTrigger>
                <TabsTrigger value="qr">Código QR</TabsTrigger>
              </TabsList>

              <TabsContent value="enlace">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="enlace-compartir">Enlace para compartir</Label>
                    <div className="flex mt-1">
                      <Input id="enlace-compartir" value={urlCompartir} readOnly className="rounded-r-none" />
                      <Button onClick={copyLink} className="rounded-l-none">
                        {enlaceCopiado ? "¡Copiado!" : "Copiar"}
                        <Copy className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Comparte este enlace con tus clientes para que se unan al programa
                    </p>
                  </div>

                  <div>
                    <Label>Compartir en redes sociales</Label>
                    <div className="flex gap-2 mt-2">
                      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Facebook className="h-5 w-5 text-blue-600" />
                        </Button>
                      </a>
                      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Twitter className="h-5 w-5 text-blue-400" />
                        </Button>
                      </a>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full">
                          <WhatsApp className="h-5 w-5 text-green-500" />
                        </Button>
                      </a>
                      <a href={mailtoUrl}>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <QrCode className="h-48 w-48 text-black" />
                  </div>
                  <Button>Descargar código QR</Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Imprime este código QR y colócalo en tu establecimiento para que los clientes puedan escanearlo
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiales promocionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
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
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Póster promocional</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PDF listo para imprimir</p>
                </div>
                <Button variant="outline">Descargar</Button>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
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
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Presentación para clientes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PowerPoint editable</p>
                </div>
                <Button variant="outline">Descargar</Button>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
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
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Guía de instrucciones</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PDF con instrucciones para clientes</p>
                </div>
                <Button variant="outline">Descargar</Button>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
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
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path d="M12 2H2v10h10V2Z" />
                    <path d="M12 12H2v10h10V12Z" />
                    <path d="M22 2h-10v20h10V2Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Banners para redes sociales</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pack de imágenes para Facebook, Instagram, etc.
                  </p>
                </div>
                <Button variant="outline">Descargar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
