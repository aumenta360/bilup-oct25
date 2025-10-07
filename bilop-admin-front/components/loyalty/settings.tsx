"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useState } from "react"
import { useToast } from "../../hooks/use-toast"
import { Loader2, Save } from "lucide-react"

export function LoyaltySettings() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para las diferentes configuraciones
  const [notificaciones, setNotificaciones] = useState({
    nuevosClientes: true,
    premiosCanjeados: true,
    recordatoriosInactividad: false,
    emailMarketing: true,
  })

  const [integraciones, setIntegraciones] = useState({
    pos: true,
    crm: false,
    email: true,
    whatsapp: false,
  })

  const [personalizacion, setPersonalizacion] = useState({
    colorPrimario: "#3b82f6",
    colorSecundario: "#1e40af",
    mostrarLogo: true,
    mostrarSucursal: true,
  })

  // Manejar cambios en notificaciones
  const handleNotificacionChange = (key: keyof typeof notificaciones, checked: boolean) => {
    setNotificaciones({
      ...notificaciones,
      [key]: checked,
    })
  }

  // Manejar cambios en integraciones
  const handleIntegracionChange = (key: keyof typeof integraciones, checked: boolean) => {
    setIntegraciones({
      ...integraciones,
      [key]: checked,
    })
  }

  // Manejar cambios en personalización
  const handlePersonalizacionChange = (key: keyof typeof personalizacion, value: string | boolean) => {
    setPersonalizacion({
      ...personalizacion,
      [key]: value,
    })
  }

  // Guardar configuración
  const handleGuardarConfiguracion = async () => {
    try {
      setIsSubmitting(true)

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente",
      })
    } catch (error) {
      console.error("Error al guardar la configuración:", error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar la configuración. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-gray-500 dark:text-gray-400">Personaliza el funcionamiento del módulo de fidelización</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="personalizacion">Personalización</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configuración general</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="nombre-negocio">Nombre del negocio</Label>
                <Input id="nombre-negocio" defaultValue="Mi Negocio" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="email-contacto">Email de contacto</Label>
                <Input id="email-contacto" type="email" defaultValue="contacto@minegocio.com" className="mt-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Este email recibirá notificaciones importantes del sistema
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="modo-pruebas">Modo de pruebas</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Las transacciones no afectarán a clientes reales
                  </p>
                </div>
                <Switch id="modo-pruebas" defaultChecked={false} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-program">Default program for new clients</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    New clients will be automatically registered in this program
                  </p>
                </div>
                <Switch id="default-program" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notif-nuevos-clientes">Nuevos clientes</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recibe notificaciones cuando un cliente se registre en un programa
                  </p>
                </div>
                <Switch
                  id="notif-nuevos-clientes"
                  checked={notificaciones.nuevosClientes}
                  onCheckedChange={(checked) => handleNotificacionChange("nuevosClientes", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notif-premios">Premios canjeados</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recibe notificaciones cuando un cliente canjee un premio
                  </p>
                </div>
                <Switch
                  id="notif-premios"
                  checked={notificaciones.premiosCanjeados}
                  onCheckedChange={(checked) => handleNotificacionChange("premiosCanjeados", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notif-inactividad">Recordatorios de inactividad</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Envía recordatorios a clientes que no han visitado en 30 días
                  </p>
                </div>
                <Switch
                  id="notif-inactividad"
                  checked={notificaciones.recordatoriosInactividad}
                  onCheckedChange={(checked) => handleNotificacionChange("recordatoriosInactividad", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notif-email">Email marketing</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Envía promociones y novedades por email a los clientes
                  </p>
                </div>
                <Switch
                  id="notif-email"
                  checked={notificaciones.emailMarketing}
                  onCheckedChange={(checked) => handleNotificacionChange("emailMarketing", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones con otros sistemas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pos-integration">Point of sale system</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Conecta con tu POS para registrar transacciones automáticamente
                  </p>
                </div>
                <Switch
                  id="pos-integration"
                  checked={integraciones.pos}
                  onCheckedChange={(checked) => handleIntegracionChange("pos", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="integ-crm">CRM</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sincroniza clientes con tu sistema de CRM</p>
                </div>
                <Switch
                  id="integ-crm"
                  checked={integraciones.crm}
                  onCheckedChange={(checked) => handleIntegracionChange("crm", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="integ-email">Plataforma de email marketing</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Conecta con tu plataforma de email marketing
                  </p>
                </div>
                <Switch
                  id="integ-email"
                  checked={integraciones.email}
                  onCheckedChange={(checked) => handleIntegracionChange("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="integ-whatsapp">WhatsApp Business</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Envía notificaciones por WhatsApp a tus clientes
                  </p>
                </div>
                <Switch
                  id="integ-whatsapp"
                  checked={integraciones.whatsapp}
                  onCheckedChange={(checked) => handleIntegracionChange("whatsapp", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalizacion">
          <Card>
            <CardHeader>
              <CardTitle>Personalización de la interfaz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="color-primario">Color primario</Label>
                <div className="flex mt-1">
                  <div
                    className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: personalizacion.colorPrimario }}
                  ></div>
                  <Input
                    id="color-primario"
                    type="text"
                    value={personalizacion.colorPrimario}
                    onChange={(e) => handlePersonalizacionChange("colorPrimario", e.target.value)}
                    className="rounded-l-none"
                  />
                  <Input
                    type="color"
                    value={personalizacion.colorPrimario}
                    onChange={(e) => handlePersonalizacionChange("colorPrimario", e.target.value)}
                    className="w-12 p-1 ml-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="color-secundario">Color secundario</Label>
                <div className="flex mt-1">
                  <div
                    className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: personalizacion.colorSecundario }}
                  ></div>
                  <Input
                    id="color-secundario"
                    type="text"
                    value={personalizacion.colorSecundario}
                    onChange={(e) => handlePersonalizacionChange("colorSecundario", e.target.value)}
                    className="rounded-l-none"
                  />
                  <Input
                    type="color"
                    value={personalizacion.colorSecundario}
                    onChange={(e) => handlePersonalizacionChange("colorSecundario", e.target.value)}
                    className="w-12 p-1 ml-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mostrar-logo">Mostrar logo en tarjetas</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Muestra el logo de tu negocio en las tarjetas de fidelización
                  </p>
                </div>
                <Switch
                  id="mostrar-logo"
                  checked={personalizacion.mostrarLogo}
                  onCheckedChange={(checked) => handlePersonalizacionChange("mostrarLogo", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mostrar-sucursal">Mostrar sucursal en tarjetas</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Muestra la sucursal donde se registró el cliente
                  </p>
                </div>
                <Switch
                  id="mostrar-sucursal"
                  checked={personalizacion.mostrarSucursal}
                  onCheckedChange={(checked) => handlePersonalizacionChange("mostrarSucursal", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleGuardarConfiguracion}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar configuración
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
