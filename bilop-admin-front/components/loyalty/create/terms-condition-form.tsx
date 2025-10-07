"use client"

import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"
import { Textarea } from "../../ui/textarea"
import { useCreateProgram } from "../../../context/create-program-context"
import React, { useState, useEffect, ForwardedRef } from "react"

const EXAMPLE = "Al unirse a nuestro programa de fidelidad, el cliente acepta los términos y condiciones. El premio no es canjeable por dinero. Válido por 6 meses."
const MAX_LENGTH = 2000

const periods = [
  { value: "day", label: "Días" },
  { value: "week", label: "Semanas" },
  { value: "month", label: "Meses" },
]

interface TermsConditionFormProps {
  value?: string
  onChange?: (val: string) => void;
  conditionsRef: ForwardedRef<HTMLTextAreaElement>;
}

const TermsConditionForm = React.forwardRef<HTMLDivElement, TermsConditionFormProps>(({ value, onChange, conditionsRef }, ref) => {
  const context = useCreateProgram()
  const conditions = value !== undefined ? value : context.conditions
  const setConditions = onChange !== undefined ? onChange : context.setConditions
  const { format, basicData, design, rules, resetConfig, setResetConfig } = context
  const [touched, setTouched] = useState(false)
  const [resetEnabled, setResetEnabled] = useState(resetConfig?.enabled ?? false)
  const [resetAmount, setResetAmount] = useState(resetConfig?.amount ?? 1)
  const [resetPeriod, setResetPeriod] = useState(resetConfig?.period ?? "day")

  const handleConditionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConditions(e.target.value)
    setTouched(true)
  }

  const handleGenerateExample = () => {
    setConditions(EXAMPLE)
    setTouched(true)
  }

  // Validaciones
  const isEmpty = !conditions.trim()
  const isTooLong = conditions.length > MAX_LENGTH
  const isInvalid = isEmpty || isTooLong

  // Reinicio por inactividad
  const handleResetToggle = (v: boolean) => setResetEnabled(v)
  const handleResetAmount = (e: React.ChangeEvent<HTMLInputElement>) => setResetAmount(Math.max(1, Number(e.target.value)))
  const handleResetPeriod = (e: React.ChangeEvent<HTMLSelectElement>) => setResetPeriod(e.target.value)

  // Sincronizar con el contexto global
  useEffect(() => {
    setResetConfig({
      enabled: resetEnabled,
      amount: resetAmount,
      period: resetPeriod
    })
  }, [resetEnabled, resetAmount, resetPeriod, setResetConfig])

  return (
    <div>
      <div className="mb-4">
        <p className="text-gray-500 dark:text-gray-400">Establece las condiciones de uso y publica tu programa</p>
      </div>
      <Card className="border rounded-xl p-8 max-w-4xl mx-auto mt-6 shadow-lg">
        <CardHeader>
          <CardTitle>Términos y Condiciones</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="condiciones">Términos y Condiciones <span className="text-red-500">*</span></Label>
              <Button type="button" variant="outline" size="sm" onClick={handleGenerateExample}>
                Generar ejemplo
              </Button>
            </div>
            <Textarea
              id="condiciones"
              placeholder="Ej: Al unirse a nuestro programa de fidelidad, el cliente acepta..."
              value={conditions}
              onChange={handleConditionsChange}
              className={`mt-1 min-h-[120px] ${isInvalid && touched ? 'border-red-500' : ''}`}
              maxLength={MAX_LENGTH}
              required
              onBlur={() => setTouched(true)}
              ref={conditionsRef}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Escribe las condiciones y términos que aplicarán a este programa de fidelización
              </p>
              <span className={`text-xs ${isTooLong ? 'text-red-500' : 'text-gray-400'}`}>{conditions.length}/{MAX_LENGTH}</span>
            </div>
            {isInvalid && touched && (
              <p className="text-xs text-red-500 mt-1">Este campo es obligatorio y debe tener menos de {MAX_LENGTH} caracteres.</p>
            )}
          </div>

          {/* Reinicio por inactividad */}
          <div className="border-t pt-6 mt-4">
            <div className="flex items-center gap-3 mb-2">
              <Switch checked={resetEnabled} onCheckedChange={handleResetToggle} />
              <span className="font-medium">Reinicio por inactividad (opcional)</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Si los clientes no han vuelto a tu negocio después del plazo que definas, sus estampillas o niveles se reiniciarán y volverán a 0.
            </p>
            {resetEnabled && (
              <div className="flex gap-4 items-end">
                <div>
                  <Label className="block mb-1">Cantidad</Label>
                  <Input type="number" min={1} value={resetAmount} onChange={handleResetAmount} className="w-24" />
                </div>
                <div>
                  <Label className="block mb-1">Unidad de tiempo</Label>
                  <select value={resetPeriod} onChange={handleResetPeriod} className="w-32 h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272F] text-gray-900 dark:text-gray-100">
                    {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Resumen del programa</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Nombre:</span> {basicData.name}
              </p>
              <p>
                <span className="font-medium">Tipo:</span> {format}
              </p>
              <p>
                <span className="font-medium">Estado:</span> {basicData.active ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
});

export default TermsConditionForm
