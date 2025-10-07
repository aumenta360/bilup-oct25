"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Check } from "lucide-react"

const AdvertisingDesign = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Diseño Publicitario</h1>
        <p className="text-gray-400">Personaliza el aspecto visual de tu página de tarjeta digital</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="templates" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Templates
          </TabsTrigger>
          <TabsTrigger value="layouts" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Layouts
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Selecciona un Template</CardTitle>
              <p className="text-sm text-gray-400">Elige el estilo visual que mejor se adapte a tu marca</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <div className="bg-gray-800 rounded-lg overflow-hidden border-2 border-amber-500">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Vista previa</span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Minimalista</h3>
                      <p className="text-xs text-gray-400">Diseño limpio y moderno con enfoque en la tarjeta</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Vista previa</span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Promocional</h3>
                      <p className="text-xs text-gray-400">Destaca ofertas y promociones especiales</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Vista previa</span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Premium</h3>
                      <p className="text-xs text-gray-400">Diseño elegante con detalles dorados</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Vista previa</span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Corporativo</h3>
                      <p className="text-xs text-gray-400">Diseño profesional para empresas</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layouts" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Personalización de Layout</CardTitle>
              <p className="text-sm text-gray-400">Configura la disposición de los elementos en tu página</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Disposición de Tarjeta</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                      <div className="w-full h-20 bg-gray-600 rounded-md mb-2"></div>
                      <span className="text-xs">Tarjeta Arriba</span>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                      <div className="w-full h-10 bg-gray-600 rounded-md mb-2"></div>
                      <div className="w-full h-10 bg-amber-500 rounded-md"></div>
                      <span className="text-xs mt-2">Tarjeta en Medio</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Estilo de Enlaces</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                      <div className="w-full flex flex-col space-y-2">
                        <div className="w-full h-8 bg-amber-500 rounded-md"></div>
                        <div className="w-full h-8 bg-amber-500 rounded-md"></div>
                      </div>
                      <span className="text-xs mt-2">Botones</span>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 flex flex-col items-center">
                      <div className="w-full flex flex-col space-y-2">
                        <div className="w-full h-8 bg-gray-600 border-b border-amber-500"></div>
                        <div className="w-full h-8 bg-gray-600 border-b border-amber-500"></div>
                      </div>
                      <span className="text-xs mt-2">Lista</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black mt-6">Aplicar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <p className="text-sm text-gray-400">Así se verá tu página de tarjeta digital</p>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg p-4 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full mb-4"></div>
                <h2 className="text-xl font-bold mb-1">Nombre de Empresa</h2>
                <p className="text-sm text-gray-400 mb-6">Programa de Fidelización</p>

                <div className="w-full max-w-md aspect-[1.6/1] bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-4 mb-6"></div>

                <div className="w-full max-w-md space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <span>Sitio Web</span>
                    <span>→</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <span>Instagram</span>
                    <span>→</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    <span>Facebook</span>
                    <span>→</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvertisingDesign
