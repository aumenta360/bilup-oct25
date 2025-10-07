import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Globe, Facebook, Instagram, Trash2, Plus, Users } from "lucide-react"

const Links = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Enlaces</h1>
        <p className="text-gray-400">Gestiona los enlaces de tu tarjeta digital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Enlaces Actuales</CardTitle>
            <p className="text-sm text-gray-400">Enlaces que aparecerán en tu tarjeta digital</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-3">
                  <Globe className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Sitio Web</p>
                  <p className="text-sm text-gray-400">https://example.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-3">
                  <Facebook className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-gray-400">https://facebook.com/example</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-700 p-2 rounded-full mr-3">
                  <Instagram className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-gray-400">https://instagram.com/example</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black mt-4">Guardar Enlaces</Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Añadir Enlace</CardTitle>
            <p className="text-sm text-gray-400">Añade enlaces a tus redes sociales y sitios web</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="link-type">Tipo de Enlace</Label>
              <Select defaultValue="web">
                <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                  <SelectValue placeholder="Sitio Web" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="web">Sitio Web</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="label">Etiqueta</Label>
              <Input
                id="label"
                placeholder="Ej: Sitio Web"
                className="bg-gray-800 border-gray-700 mt-1"
                defaultValue="Sitio Web"
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://example.com" className="bg-gray-800 border-gray-700 mt-1" />
            </div>

            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Enlace
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 mt-6">
        <CardHeader>
          <CardTitle>Enlace de Referidos</CardTitle>
          <p className="text-sm text-gray-400">Configura el enlace para que tus clientes puedan referir a otros</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-gray-800 rounded-lg mb-4">
            <div className="bg-gray-700 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium">Programa de Referidos</p>
              <p className="text-sm text-gray-400">Configura tu programa de referidos en la sección correspondiente</p>
            </div>
          </div>

          <Button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700">
            Ir a Configuración de Referidos
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Links;
