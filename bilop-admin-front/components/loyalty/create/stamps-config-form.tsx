"use client"

import React, { useState, useEffect, ForwardedRef } from "react"
import { Card, CardContent } from "../../ui/card"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Upload } from "lucide-react"
import UsageLimitForm from "./usage-limit-form"
import { useToast } from "../../../hooks/use-toast"

const ICONS = [
  { name: "Estrella", icon: "⭐" },
  { name: "Corazón", icon: "❤️" },
  { name: "Café", icon: "☕" },
  { name: "Taza", icon: "🍵" },
  { name: "Regalo", icon: "🎁" },
  { name: "Tienda", icon: "🏪" },
  { name: "Pastel", icon: "🎂" },
  { name: "Pet", icon: "🐾" },
]

interface StampsConfigFormProps {
  value: any
  onChange: (data: any) => void;
  requiredStampsRef: ForwardedRef<HTMLInputElement>;
  preFilledStampsRef: ForwardedRef<HTMLInputElement>;
}

const StampsConfigForm = React.forwardRef<HTMLDivElement, StampsConfigFormProps>(({ value, onChange, requiredStampsRef, preFilledStampsRef }, ref) => {
  const [totalStamps, setTotalStamps] = useState(value.stamps.requiredStamps || 10)
  const [preFilled, setPreFilled] = useState(value.stamps.preFilledStamps || 0)
  const [onComplete, setOnComplete] = useState<"unlimited" | "limit" | "reset">(value.stamps.onCompleteBehavior || 'unlimited')
  const [limitEnabled, setLimitEnabled] = useState(value.usageLimits.enabled || false)
  const [maxActions, setMaxActions] = useState(value.usageLimits.maxUses || 1)
  const [period, setPeriod] = useState<"day" | "week" | "month">(value.usageLimits.period || 'day')
  
  // Determine initial selected icon and custom image data
  const initialCustomStampImageData = value.stamps.customStampImage || null;
  const initialSelectedIcon = initialCustomStampImageData ? '' : (value.stamps.customStampIcon || ICONS[4].icon);

  const [selectedIcon, setSelectedIcon] = useState(initialSelectedIcon);
  const [customStampImageData, setCustomStampImageData] = useState<string | null>(initialCustomStampImageData);
  const [customIconName, setCustomIconName] = useState("")

  const { toast } = useToast();

  // Handlers
  const handleTotalStamps = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Math.max(4, Math.min(20, Number(e.target.value)))
    setTotalStamps(v)
    if (preFilled >= v) setPreFilled(0)
    onChange({
      ...value,
      stamps: { ...value.stamps, requiredStamps: v }
    })
  }
  const handlePreFilled = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Math.max(0, Math.min(totalStamps - 1, Number(e.target.value)))
    setPreFilled(v)
    onChange({
      ...value,
      stamps: { ...value.stamps, preFilledStamps: v }
    })
  }
  const handleOnComplete = (v: 'unlimited' | 'limit' | 'reset') => {
    setOnComplete(v)
    onChange({
      ...value,
      stamps: { ...value.stamps, onCompleteBehavior: v }
    })
  }
  const handleLimitSwitch = (v: boolean) => {
    setLimitEnabled(v)
    onChange({
      ...value,
      usageLimits: { ...value.usageLimits, enabled: v }
    })
  }
  const handleMaxActions = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Math.max(1, Number(e.target.value))
    setMaxActions(v)
    onChange({
      ...value,
      usageLimits: { ...value.usageLimits, maxUses: v }
    })
  }
  const handlePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as "day" | "week" | "month")
    onChange({
      ...value,
      usageLimits: { ...value.usageLimits, period: e.target.value }
    })
  }
  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon)
    setCustomStampImageData(null)
    setCustomIconName("")
    onChange({
      ...value,
      stamps: { ...value.stamps, customStampIcon: icon, customStampImage: null }
    })
  }
  const handleCustomIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 50 * 1024 && file.type.includes('png')) {
      setCustomIconName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setCustomStampImageData(reader.result as string)
        setSelectedIcon("")
        onChange({
          ...value,
          stamps: { ...value.stamps, customStampIcon: null, customStampImage: reader.result as string }
        })
      }
      reader.readAsDataURL(file)
    } else {
      toast({ title: "Error", description: "Solo PNG ≤ 50KB" });
    }
  }

  // Vista previa de estampillas
  const previewIcon = customStampImageData ? <img src={customStampImageData} alt="icono" className="w-6 h-6 inline" /> : <span className="text-xl">{selectedIcon}</span>

  // Sincronizar estados locales con el value global
  useEffect(() => {
    onChange({
      ...value,
      stamps: {
        ...value.stamps,
        preFilledStamps: preFilled,
        onCompleteBehavior: onComplete,
        customStampIcon: selectedIcon,
        customStampImage: customStampImageData || null,
      },
      usageLimits: {
        ...value.usageLimits,
        enabled: limitEnabled,
        maxUses: maxActions,
        period: period,
      }
    })
    // eslint-disable-next-line
  }, [preFilled, onComplete, customStampImageData, limitEnabled, maxActions, period, selectedIcon])

  return (
    <>
      <Card className="border rounded-xl p-8 max-w-4xl mx-auto mt-6 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-lg font-semibold mb-2">Configuración de Estampillas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block mb-1">Nº total de estampillas <span className="text-red-500">*</span></Label>
              <Input type="number" min={4} max={20} value={totalStamps} onChange={handleTotalStamps} className="mb-2" ref={requiredStampsRef} />
              <span className="text-xs text-gray-500 dark:text-gray-400">Obligatorio. Entre 4 y 20. Valor por defecto: 10</span>
            </div>
            <div>
              <Label className="block mb-1">Estampillas pre-llenadas <span className="text-red-500">*</span></Label>
              <Input type="number" min={0} max={totalStamps-1} value={preFilled} onChange={handlePreFilled} className="mb-2" ref={preFilledStampsRef} />
              <span className="text-xs text-gray-500 dark:text-gray-400">Estampillas iniciales al crear una nueva tarjeta</span>
            </div>
          </div>
          <div className="mt-4">
            <Label className="block mb-2">Al completar estampillas <span className="text-red-500">*</span></Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer flex-col">
                <input type="radio" checked={onComplete==='unlimited'} onChange={()=>handleOnComplete('unlimited')} />
                <span>Sin límite</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Las estampillas se siguen acumulando indefinidamente.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-col">
                <input type="radio" checked={onComplete==='limit'} onChange={()=>handleOnComplete('limit')} />
                <span>Limitar</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Se detiene al alcanzar el máximo.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-col">
                <input type="radio" checked={onComplete==='reset'} onChange={()=>handleOnComplete('reset')} />
                <span>Reiniciar</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Se reinicia automáticamente al completar.</span>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <Label className="block mb-2">Ícono de Estampilla</Label>
            <div className="flex gap-6 flex-wrap">
              <div>
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Predeterminados</div>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map((ic, idx) => (
                    <button key={ic.name} type="button" className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl ${selectedIcon===ic.icon&&!customStampImageData?'border-blue-500':'border-gray-300 dark:border-gray-700'}`} onClick={()=>handleIconSelect(ic.icon)}>
                      {ic.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Subir icono</div>
                <label className="w-10 h-10 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <input type="file" accept="image/png" onChange={handleCustomIcon} className="hidden" />
                </label>
                {customIconName && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[80px]">{customIconName}</span>}
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Vista previa</h2>
            <div className="flex gap-2 flex-wrap mb-2">
              {Array.from({ length: totalStamps }).map((_, i) => (
                <span key={i} className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${i<preFilled?'border-green-400 bg-green-100 dark:bg-green-900/30':'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'}`}>
                  {previewIcon}
                </span>
              ))}
            </div>
          </CardContent>
        </CardContent>
      </Card>
      <UsageLimitForm
        enabled={limitEnabled}
        setEnabled={setLimitEnabled}
        maxActions={maxActions}
        setMaxActions={setMaxActions}
        period={period}
        setPeriod={setPeriod}
      />
    </>
  )
})

export default StampsConfigForm