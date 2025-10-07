import React from "react"
import { Card, CardContent } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"

interface UsageLimitFormProps {
  enabled: boolean
  setEnabled: (v: boolean) => void
  maxActions: number
  setMaxActions: (v: number) => void
  period: "day" | "week" | "month"
  setPeriod: (v: "day" | "week" | "month") => void
}

const periods = [
  { value: "day", label: "Día" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
]

const UsageLimitForm: React.FC<UsageLimitFormProps> = ({ enabled, setEnabled, maxActions, setMaxActions, period, setPeriod }) => {
  return (
    <Card className="border rounded-xl p-8 max-w-4xl mx-auto mt-6 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-1">Límites de Uso</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Configura cuántas veces se puede usar la tarjeta en un período determinado</p>
        <div className="flex items-center gap-3 mb-2">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <span className="text-sm font-medium">Activar límites</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Establece restricciones de uso para la tarjeta</span>
        {enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="w-full">
              <Label className="block mb-1">Nº máximo de acciones</Label>
              <Input type="number" min={1} value={maxActions} onChange={e => setMaxActions(Math.max(1, Number(e.target.value)))} className="w-full" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Cantidad máxima de veces que se puede usar</span>
            </div>
            <div className="w-full">
              <Label className="block mb-1">Período</Label>
              <select value={period} onChange={e => setPeriod(e.target.value as "day" | "week" | "month")} className="w-full min-w-[180px] h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272F] text-gray-900 dark:text-gray-100">
                {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">Intervalo de tiempo para el límite</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UsageLimitForm 