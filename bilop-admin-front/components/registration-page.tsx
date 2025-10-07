import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Switch } from "../components/ui/switch"
import { GripVertical, Trash2 } from "lucide-react"

const RegistrationPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Página de Registro</h1>
        <p className="text-gray-400">Personaliza la página de registro para tus usuarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Detalles de la Página</CardTitle>
            <p className="text-sm text-gray-400">Configura el título y la descripción de la página de registro</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="page-title">Título de la Página</Label>
              <Input
                id="page-title"
                placeholder="Ex: Join our loyalty program"
                className="bg-gray-800 border-gray-700 mt-1"
                defaultValue="Join our loyalty program"
              />
            </div>

            <div>
              <Label htmlFor="page-description">Descripción</Label>
              <Textarea
                id="page-description"
                placeholder="Describe los beneficios de registrarse"
                className="bg-gray-800 border-gray-700 mt-1 min-h-[100px]"
                defaultValue="Regístrate para obtener beneficios exclusivos y acumular puntos con cada compra."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <p className="text-sm text-gray-400">Así se verá tu página de registro</p>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">Join our loyalty program</h2>
                <p className="text-sm text-gray-400">
                  Regístrate para obtener beneficios exclusivos y acumular puntos con cada compra.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="preview-name">Nombre *</Label>
                  <Input id="preview-name" placeholder="Tu nombre" className="bg-gray-800 border-gray-700 mt-1" />
                </div>

                <div>
                  <Label htmlFor="preview-lastname">Apellido *</Label>
                  <Input id="preview-lastname" placeholder="Tu apellido" className="bg-gray-800 border-gray-700 mt-1" />
                </div>

                <div>
                  <Label htmlFor="preview-email">Email *</Label>
                  <Input id="preview-email" placeholder="tu@email.com" className="bg-gray-800 border-gray-700 mt-1" />
                </div>

                <div>
                  <Label htmlFor="preview-phone">Teléfono</Label>
                  <Input
                    id="preview-phone"
                    placeholder="Tu número de teléfono"
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="preview-birthdate">Fecha de cumpleaños</Label>
                  <Input
                    id="preview-birthdate"
                    placeholder="mm / dd / yyyy"
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="preview-gender">Género</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                      <SelectItem value="prefer-not">Prefiero no decirlo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black mt-2">Registrarse</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 mt-6">
        <CardHeader>
          <CardTitle>Campos del Formulario</CardTitle>
          <p className="text-sm text-gray-400">Gestiona los campos que aparecerán en el formulario de registro</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <GripVertical className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="font-medium">Nombre</p>
                <p className="text-xs text-gray-400">text</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="visible-name" defaultChecked />
                <Label htmlFor="visible-name" className="text-sm">
                  Visible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="required-name" defaultChecked />
                <Label htmlFor="required-name" className="text-sm">
                  Requerido
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <GripVertical className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="font-medium">Apellido</p>
                <p className="text-xs text-gray-400">text</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="visible-lastname" defaultChecked />
                <Label htmlFor="visible-lastname" className="text-sm">
                  Visible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="required-lastname" defaultChecked />
                <Label htmlFor="required-lastname" className="text-sm">
                  Requerido
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <GripVertical className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-xs text-gray-400">email</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="visible-email" defaultChecked />
                <Label htmlFor="visible-email" className="text-sm">
                  Visible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="required-email" defaultChecked />
                <Label htmlFor="required-email" className="text-sm">
                  Requerido
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <GripVertical className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-xs text-gray-400">tel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="visible-phone" defaultChecked />
                <Label htmlFor="visible-phone" className="text-sm">
                  Visible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="required-phone" defaultChecked />
                <Label htmlFor="required-phone" className="text-sm">
                  Requerido
                </Label>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegistrationPage