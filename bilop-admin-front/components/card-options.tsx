"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Textarea } from "../components/ui/textarea"
import { CreditCard } from "lucide-react"

const CardOptions = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Opciones de Tarjeta</h1>
        <p className="text-gray-400">Personaliza la apariencia de tu tarjeta digital</p>
      </div>

      <Tabs defaultValue="diseno">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="diseno" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Diseño
          </TabsTrigger>
          <TabsTrigger value="vista" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diseno" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Detalles de la Tarjeta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="card-name">Nombre de la Tarjeta</Label>
                  <Input
                    id="card-name"
                    placeholder="Ej: Tarjeta Premium"
                    className="bg-gray-800 border-gray-700 mt-1"
                    defaultValue="Tarjeta Premium"
                  />
                </div>

                <div>
                  <Label htmlFor="card-title">Título de la Tarjeta</Label>
                  <Input
                    id="card-title"
                    placeholder="Ej: CLUB VIP"
                    className="bg-gray-800 border-gray-700 mt-1"
                    defaultValue="CLUB VIP"
                  />
                  <p className="text-xs text-gray-400 mt-1">Este texto aparecerá destacado en la tarjeta</p>
                </div>

                <div>
                  <Label htmlFor="card-description">Descripción</Label>
                  <Textarea
                    id="card-description"
                    placeholder="Describe los beneficios de tu tarjeta"
                    className="bg-gray-800 border-gray-700 mt-1 min-h-[100px]"
                    defaultValue="Disfruta de beneficios exclusivos y acumula puntos con cada compra. ¡Gracias por tu fidelidad!"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Esta descripción aparecerá en la parte trasera de la tarjeta
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Color Principal</Label>
                    <div className="flex mt-1">
                      <div className="w-10 h-10 bg-amber-500 rounded-l-md"></div>
                      <Input
                        id="primary-color"
                        className="bg-gray-800 border-gray-700 rounded-l-none"
                        defaultValue="#FF9D0D"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Color Secundario</Label>
                    <div className="flex mt-1">
                      <div className="w-10 h-10 bg-black rounded-l-md"></div>
                      <Input
                        id="secondary-color"
                        className="bg-gray-800 border-gray-700 rounded-l-none"
                        defaultValue="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bg-color">Color de Fondo</Label>
                    <div className="flex mt-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-l-md"></div>
                      <Input
                        id="bg-color"
                        className="bg-gray-800 border-gray-700 rounded-l-none"
                        defaultValue="#f1f1f1"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black mt-4">Guardar Cambios</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Opciones Adicionales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label>Forma de mostrar la promoción</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 text-black p-2 rounded-md mb-2">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <span className="text-sm">Estrellas</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 text-black p-2 rounded-md mb-2">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <span className="text-sm">Puntos</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Label>Estilo de Tarjeta</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 w-full h-16 rounded-md mb-2"></div>
                      <span className="text-sm">Gradiente</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 w-full h-16 rounded-md mb-2"></div>
                      <span className="text-sm">Sólido</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Efectos Visuales</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 w-full h-16 rounded-md mb-2"></div>
                      <span className="text-sm">Brillo</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                      <div className="bg-amber-500 w-full h-16 rounded-md mb-2"></div>
                      <span className="text-sm">Sombra</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vista" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="w-full max-w-md aspect-[1.6/1] bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white rounded-lg"></div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-black">CLUB VIP</h3>
                      <p className="text-sm text-black opacity-80">Tarjeta Premium</p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-black opacity-70">Miembro desde</p>
                        <p className="text-sm font-medium text-black">Abril 2025</p>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="w-6 h-6 bg-black bg-opacity-20 rounded-full flex items-center justify-center"
                          >
                            <div
                              className={`w-4 h-4 rounded-full ${star <= 3 ? "bg-black" : "bg-gray-400 bg-opacity-30"}`}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CardOptions;
