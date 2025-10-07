import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { X } from "lucide-react"

const Images = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Imágenes</h1>
        <p className="text-gray-400">Gestiona las imágenes de tu tarjeta digital y página de registro</p>
      </div>

      <Tabs defaultValue="logo">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="logo" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Logo
          </TabsTrigger>
          <TabsTrigger value="portada" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Portada de Tarjeta
          </TabsTrigger>
          <TabsTrigger value="registro" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
            Página de Registro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Logo Cuadrado</CardTitle>
                <p className="text-sm text-gray-400">Este logo se utilizará en la tarjeta digital</p>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <div className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                  <button className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Formato recomendado: PNG/JPG, tamaño: 400x400px mínimo, fondo transparente
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Logo Horizontal</CardTitle>
                <p className="text-sm text-gray-400">Este logo se utilizará en la página de registro</p>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <div className="w-48 h-24 bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                  <button className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Formato recomendado: PNG/JPG, tamaño: 600x300px mínimo, fondo transparente
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-4">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">Guardar Cambios</Button>
          </div>
        </TabsContent>

        <TabsContent value="portada" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Imagen de Portada</CardTitle>
              <p className="text-sm text-gray-400">Esta imagen se mostrará como fondo de tu tarjeta digital</p>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
                <button className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400">Formato recomendado: PNG/JPG, tamaño: 1200x600px mínimo</p>

              <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-black">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registro" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Imagen de Fondo</CardTitle>
              <p className="text-sm text-gray-400">Esta imagen se mostrará como fondo de tu página de registro</p>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
                <button className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400">Formato recomendado: PNG/JPG, tamaño: 1920x1080px mínimo</p>

              <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-black">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Images;
