"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

const Colors = () => {
  const [primaryColor, setPrimaryColor] = useState("#3B82F6") // Azul por defecto
  const [secondaryColor, setSecondaryColor] = useState("#1E293B") // Gris oscuro por defecto
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF") // Blanco por defecto

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Colores</h1>
        <p className="text-gray-500 dark:text-gray-400">Personaliza los colores de tu tarjeta digital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Selección de Colores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="primary-color">Color Principal</Label>
              <div className="flex mt-1">
                <div className="w-10 h-10 rounded-l-md" style={{ backgroundColor: primaryColor }}></div>
                <Input
                  id="primary-color"
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="rounded-l-none"
                />
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 p-1 ml-2"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este color se usará para botones, íconos y elementos destacados
              </p>
            </div>

            <div>
              <Label htmlFor="secondary-color">Color Secundario</Label>
              <div className="flex mt-1">
                <div className="w-10 h-10 rounded-l-md" style={{ backgroundColor: secondaryColor }}></div>
                <Input
                  id="secondary-color"
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="rounded-l-none"
                />
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 p-1 ml-2"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este color se usará para textos y detalles secundarios
              </p>
            </div>

            <div>
              <Label htmlFor="background-color">Color de Fondo</Label>
              <div className="flex mt-1">
                <div className="w-10 h-10 rounded-l-md" style={{ backgroundColor: backgroundColor }}></div>
                <Input
                  id="background-color"
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="rounded-l-none"
                />
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 p-1 ml-2"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este color se usará como fondo principal de la tarjeta
              </p>
            </div>

            <div className="pt-4">
              <Button className="w-full">Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                className="w-full max-w-md aspect-[1.6/1] rounded-xl shadow-lg p-6 flex flex-col justify-between"
                style={{
                  backgroundColor: primaryColor,
                  color: backgroundColor,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: backgroundColor }}></div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold" style={{ color: backgroundColor }}>
                      CLUB VIP
                    </h3>
                    <p className="text-sm opacity-80" style={{ color: backgroundColor }}>
                      Tarjeta Premium
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70" style={{ color: backgroundColor }}>
                        Miembro desde
                      </p>
                      <p className="text-sm font-medium" style={{ color: backgroundColor }}>
                        Abril 2025
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${secondaryColor}40` }}
                        >
                          <div
                            className={`w-4 h-4 rounded-full`}
                            style={{
                              backgroundColor: star <= 3 ? backgroundColor : `${backgroundColor}40`,
                            }}
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
      </div>
    </div>
  )
}

export default Colors;