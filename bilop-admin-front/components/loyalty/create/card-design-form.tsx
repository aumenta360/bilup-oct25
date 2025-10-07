"use client"

import { Button } from "../../../components/ui/button"
import { contrastRatio } from "../../utils/color"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Upload } from "lucide-react"
import React, { useState, forwardRef } from "react"
import { useToast } from "../../../hooks/use-toast"
import { Card, CardContent } from "../../../components/ui/card"
import Image from "next/image"

interface DesignData {
  primaryColor?: string
  secondaryColor?: string
  logo?: string
  heroImage?: string
  totalStamps?: number
  preFilledStamps?: number
  customStampIcon?: string
  customStampImage?: string
}

interface CardDesignFormProps {
  value: DesignData
  onChange: (data: DesignData) => void
  setLogoError: (error: string | null) => void
  setHeroImageError: (error: string | null) => void
  logoError: string | null
  heroImageError: string | null
  previewOnly?: boolean
}

const CardDesignForm = forwardRef<HTMLDivElement, CardDesignFormProps>(({ value, onChange, setLogoError, setHeroImageError, logoError, heroImageError, previewOnly }, ref) => {
  const [hideCards, setHideCards] = useState(false)
  const [logoName, setLogoName] = useState<string>("")
  const [heroImageName, setHeroImageName] = useState<string>("")
  const [iconName, setIconName] = useState<string>("")

  const { toast } = useToast()

  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const previews = [
    { key: "appleWallet", label: "Apple Wallet" },
    { key: "googleWallet", label: "Google Wallet" },
    { key: "notification", label: "Notificaciones" }
  ];

  const handleTabClick = (index: number) => {
    setCurrentPreviewIndex(index);
  };

  // Validaciones de imágenes
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 300 * 1024) {
        toast({ title: "Error", description: "El logo debe pesar máximo 300 KB" })
        return
      }
      if (!file.type.includes("png")) {
        toast({ title: "Error", description: "El logo debe ser PNG transparente" })
        return
      }
      setLogoError(null)
      setLogoName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, logo: reader.result as string })
        console.log('Logo changed:', reader.result as string)
        console.log('Updated value.logo:', { ...value, logo: reader.result as string }.logo)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "Error", description: "La imagen de fondo debe pesar máximo 1 MB" })
        return
      }
      if (!file.type.includes("jpeg") && !file.type.includes("png")) {
        toast({ title: "Error", description: "La imagen debe ser JPG o PNG" })
        return
      }
      setHeroImageError(null)
      setHeroImageName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, heroImage: reader.result as string })
        console.log('Hero image changed:', reader.result as string)
        console.log('Updated value.heroImage:', { ...value, heroImage: reader.result as string }.heroImage)
      }
      reader.readAsDataURL(file)
    }
  }

  // Sincronización de inputs de color y texto
  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    // Si es input de color, asegúrate de que sea #RRGGBB
    if (e.target.type === 'color' && !/^#[0-9A-Fa-f]{6}$/.test(val)) {
      val = '#000000'
    }
    onChange({ ...value, primaryColor: val })
  }
  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (e.target.type === 'color' && !/^#[0-9A-Fa-f]{6}$/.test(val)) {
      val = '#ffffff'
    }
    onChange({ ...value, secondaryColor: val })
  }

  // Validación de contraste
  const contrast = contrastRatio(value.secondaryColor || "#000000", value.primaryColor || "#ffffff")
  const contrastOk = contrast >= 4.5

  // Handler para icono de notificaciones
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024) {
        toast({ title: "Error", description: "El icono debe pesar máximo 100 KB" })
        return
      }
      if (!file.type.includes("png")) {
        toast({ title: "Error", description: "El icono debe ser PNG" })
        return
      }
      setIconName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, customStampImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div ref={ref} className={`max-w-md w-full ${previewOnly ? 'ml-auto' : 'mx-auto'}`}>
      {/* Solo mostrar la vista previa si previewOnly está activo, si no, mostrar todo */}
      {previewOnly ? (
        <>
          {/* Vista previa */}
          <div className="flex flex-col items-center">
            {/* Apple Wallet Preview */}
            {currentPreviewIndex === 0 && (
              <Card className="shadow-xl rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-[#181C23]">
                <h2 className="font-bold text-center mt-4">Apple Wallet</h2>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-[300px] h-[500px] rounded-2xl shadow-lg flex flex-col overflow-hidden"
                    style={{ backgroundColor: value.primaryColor, color: value.secondaryColor }}>

                    {/* Top section: Cliente */}
                    <div className="flex w-full justify-between items-start p-4" style={{ backgroundColor: value.primaryColor }}>
                      <div className="flex items-center gap-2">
                        {value.logo ? (
                          <Image src={value.logo} alt="Logo" width={50} height={50} className="object-contain rounded-full bg-white border-2 border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-xs font-semibold opacity-90" style={{ color: value.secondaryColor || "#FFFFFF" }}>Cliente</p>
                        <p className="text-sm opacity-90" style={{ color: value.secondaryColor || "#FFFFFF" }}>Smith</p>
                      </div>
                    </div>

                    {/* Middle section: Background image and stamps */}
                    <div className="relative w-full h-[240px] overflow-hidden px-4 py-2" style={{ backgroundColor: value.primaryColor }}>
                      {value.heroImage && (
                        <Image src={value.heroImage} alt="Imagen fondo" fill className="object-cover" />
                      )}
                      <div className="absolute inset-0 grid grid-cols-5 place-items-center p-4 gap-y-1">
                        {/* Stamps/Stars */}
                        {[...Array(value.totalStamps || 15)].map((_, i) => {
                          const stampNumber = i + 1;
                          const isFilled = stampNumber <= (value.preFilledStamps || 0);

                          return (
                            <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center relative"
                              style={{
                                backgroundColor: value.primaryColor || "#000000",
                                border: `2px solid ${value.secondaryColor || "#FFFFFF"}`,
                              }}>
                              {isFilled ? (
                                // Estampa llena: fondo sólido, contenido es el icono personalizado o estrella
                                value.customStampImage ? (
                                  <Image src={value.customStampImage} alt="Stamp Icon" width={20} height={20} className="object-contain" />
                                ) : value.customStampIcon ? (
                                  <span className="text-2xl" style={{ color: value.secondaryColor || "#FFFFFF" }}>{value.customStampIcon}</span>
                                ) : (
                                  <span className="text-2xl" style={{ color: value.secondaryColor || "#FFFFFF" }}>⭐</span>
                                )
                              ) : (
                                // Estampa no llena: círculo interior translúcido, contenido es el número
                                <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${value.secondaryColor || "#FFFFFF"}40`,
                                  }}>
                                  <span className="text-lg font-bold" style={{ color: value.secondaryColor || "#FFFFFF" }}>{stampNumber}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom section: Visits, Sellos, QR, Phone */}
                    <div className="flex flex-col items-center p-4" style={{ backgroundColor: value.primaryColor, color: value.secondaryColor }}>
                      <div className="flex w-full justify-between items-start mb-4">
                        <div className="flex flex-col items-start">
                          <p className="text-xs opacity-70" style={{ color: value.secondaryColor || "#FFFFFF" }}>SELLOS TOTALES</p>
                          <p className="text-lg font-bold">{value.totalStamps}</p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs opacity-70" style={{ color: value.secondaryColor || "#FFFFFF" }}>SELLOS COMPLETADOS</p>
                          <p className="text-lg font-bold">{value.preFilledStamps}</p>
                        </div>
                      </div>
                      {/* QR Code Placeholder */}
                      <div className="p-4">
                      <div className="w-28 h-36 bg-white flex flex-col items-center justify-center rounded-lg p-4">
                        <Image
                          src="/QRbilop.svg"
                          alt="QR Code Placeholder"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <p className="text-xs font-semibold" style={{ color: value.primaryColor || "#000000" }}>By Bilup</p>
                      </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Google Wallet Preview */}
            {currentPreviewIndex === 1 && (
              <Card className="shadow-xl rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-[#181C23]">
                <h2 className="font-bold text-center mt-4">Google Wallet</h2>
                <CardContent className="flex flex-col items-center">
                  <div className="w-[300px] h-[500px] rounded-2xl shadow-lg flex flex-col overflow-hidden"
                    style={{ backgroundColor: value.primaryColor, color: value.secondaryColor }}>

                    {/* Top section: Cliente */}
                    <div className="flex w-full justify-between items-start p-4" style={{ backgroundColor: value.primaryColor }}>
                      <div className="flex items-center gap-2">
                        {value.logo ? (
                          <Image src={value.logo} alt="Logo" width={50} height={50} className="object-contain rounded-full bg-white border-2 border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-xs font-semibold opacity-90" style={{ color: value.secondaryColor || "#FFFFFF" }}>Cliente</p>
                        <p className="text-sm opacity-90" style={{ color: value.secondaryColor || "#FFFFFF" }}>Smith</p>
                      </div>
                    </div>

                    {/* Google Wallet specific layout (Visits, Sellos, QR, Phone at top/middle) */}
                    <div className="flex flex-col items-center p-4" style={{ backgroundColor: value.primaryColor, color: value.secondaryColor }}>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="w-full text-left mb-4">
                          <p className="text-xs opacity-70" style={{ color: value.secondaryColor || "#FFFFFF" }}>SELLOS TOTALES</p>
                          <p className="text-lg font-bold">{value.totalStamps}</p>
                        </div>
                        <div className="w-full mb-4">
                          <p className="text-xs opacity-70" style={{ color: value.secondaryColor || "#FFFFFF" }}>SELLOS COMPLETADOS</p>
                          <p className="text-lg font-bold">{value.preFilledStamps}</p>
                        </div>
                      </div>
                      {/* QR Code Placeholder */}
                      <div className="p-4">
                      <div className="w-28 h-36 bg-white flex flex-col items-center justify-center rounded-lg p-4">
                        <Image
                          src="/QRbilop.svg"
                          alt="QR Code Placeholder"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                          <p className="text-xs font-semibold" style={{ color: value.primaryColor || "#000000" }}>By Bilup</p>
                        </div>
                      </div>
                    </div>

                    {/* Stamps for Google Wallet (at the bottom) */}
                    <div className="relative w-full h-[240px] overflow-hidden" style={{ backgroundColor: value.primaryColor }}>
                      {value.heroImage && (
                        <Image src={value.heroImage} alt="Imagen fondo" fill className="object-cover" />
                      )}
                      <div className="absolute inset-0 grid grid-cols-5 place-items-center p-4 gap-y-1">
                        {/* Stamps/Stars */}
                        {[...Array(value.totalStamps || 15)].map((_, i) => {
                          const stampNumber = i + 1;
                          const isFilled = stampNumber <= (value.preFilledStamps || 0);

                          return (
                            <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center relative"
                              style={{
                                backgroundColor: value.primaryColor || "#000000",
                                border: `2px solid ${value.secondaryColor || "#FFFFFF"}`,
                              }}>
                              {isFilled ? (
                                // Estampa llena: fondo sólido, contenido es el icono personalizado o estrella
                                value.customStampImage ? (
                                  <Image src={value.customStampImage} alt="Stamp Icon" width={20} height={20} className="object-contain" />
                                ) : value.customStampIcon ? (
                                  <span className="text-2xl" style={{ color: value.secondaryColor || "#FFFFFF" }}>{value.customStampIcon}</span>
                                ) : (
                                  <span className="text-2xl" style={{ color: value.secondaryColor || "#FFFFFF" }}>⭐</span>
                                )
                              ) : (
                                // Estampa no llena: círculo interior translúcido, contenido es el número
                                <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${value.secondaryColor || "#FFFFFF"}40`,
                                  }}>
                                  <span className="text-lg font-bold" style={{ color: value.secondaryColor || "#FFFFFF" }}>{stampNumber}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Notification Preview */}
            {currentPreviewIndex === 2 && (
              <Card className="shadow-xl rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-[#181C23]">
                <h2 className="font-bold text-center mt-4">Notificaciones</h2>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    {value.logo ? (
                      <Image src={value.logo} alt="Logo" width={48} height={48} className="object-contain rounded-full" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">PROGRAMA DE ESTAMPILLAS</p>
                      <p className="text-xs text-gray-500">Ahora</p>
                    </div>
                    <h3 className="text-base font-bold mb-1">¡Bienvenido/a a Programa de Estampillas!</h3>
                    <p className="text-xs text-gray-500">Así se verán tus notificaciones.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Tabs para cambiar de vista */}
            <div className="flex border-b mb-6">
              {previews.map((tab, index) => (
                <button
                  key={tab.key}
                  className={`px-6 py-2 font-medium border-b-2 transition-colors duration-150 ${currentPreviewIndex === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
                  onClick={() => handleTabClick(index)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Si no es previewOnly, mostrar todo el formulario (inputs, etc.)
        <>
          {/* Header: pickers y checkbox */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex gap-8 items-end">
              <div className="flex flex-col items-center">
                <Label className="mb-1">Color del texto</Label>
                <Input type="color" value={value.secondaryColor || "#FFFFFF"} onChange={handleSecondaryColorChange} className="w-12 h-12 rounded-lg border-2 border-gray-300" />
                <Input type="text" value={value.secondaryColor || "#FFFFFF"} onChange={handleSecondaryColorChange} className="mt-2 w-24 text-center rounded-md" />
              </div>
              <div className="flex flex-col items-center">
                <Label className="mb-1">Color de fondo</Label>
                <Input type="color" value={value.primaryColor || "#000000"} onChange={handlePrimaryColorChange} className="w-12 h-12 rounded-lg border-2 border-gray-300" />
                <Input type="text" value={value.primaryColor || "#000000"} onChange={handlePrimaryColorChange} className="mt-2 w-24 text-center rounded-md" />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Input type="checkbox" id="hide-cards" checked={hideCards} onChange={e => setHideCards(e.target.checked)} className="w-5 h-5" />
                <Label htmlFor="hide-cards" className="text-sm">Ocultar tarjetas</Label>
              </div>
              {hideCards && (
                <span className="text-xs text-blue-600 mt-1">Las tarjetas estarán ocultas para los clientes hasta que sean publicadas.</span>
              )}
            </div>
          </div>
          {/* Validación de contraste */}
          {!contrastOk && (
            <div className="text-xs text-red-500 mb-4 text-center">El contraste entre el texto y el fondo no cumple con WCAG AA (mínimo 4.5:1)</div>
          )}
          {/* Imágenes */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
            {/* Imagen fondo */}
            <div className="flex-1 text-center min-w-[180px]">
              <Label className="block mb-1 font-medium text-sm">Imagen Hero<span className="text-red-500">*</span><br /><span className="text-xs font-normal">(1024x256px, JPG/PNG, ≤1MB)</span></Label>
              <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Subir imagen</span>
                  <input type="file" accept="image/png,image/jpeg" onChange={handleBgChange} className="hidden" />
                </label>
                {heroImageName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{heroImageName}</span>}
                {value.heroImage && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setHeroImageName(""); onChange({ ...value, heroImage: undefined }) }}>Quitar</Button>}
              </div>
              {heroImageError && <p className="text-red-500 text-xs mt-1">{heroImageError}</p>}
            </div>
            {/* Logo */}
            <div className="flex-1 text-center min-w-[180px]">
              <Label className="block mb-1 font-medium text-sm">Logo<span className="text-red-500">*</span><br /><span className="text-xs font-normal">(PNG transparente, ≤300KB, 600x600px)</span></Label>
              <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Subir logo</span>
                  <input type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
                </label>
                {logoName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{logoName}</span>}
                {value.logo && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setLogoName(""); onChange({ ...value, logo: undefined }) }}>Quitar</Button>}
              </div>
              {logoError && <p className="text-red-500 text-xs mt-1">{logoError}</p>}
            </div>
            {/* Icono notificación (opcional) */}
            <div className="flex-1 text-center min-w-[180px]">
              <Label className="block mb-1 font-medium text-sm">Icono notificaciones<br /><span className="text-xs font-normal">(PNG, 100x100px, opcional)</span></Label>
              <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Subir icono</span>
                  <input type="file" accept="image/png" onChange={handleIconChange} className="hidden" />
                </label>
                {iconName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{iconName}</span>}
                {value.customStampImage && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setIconName(""); onChange({ ...value, customStampImage: undefined }) }}>Quitar</Button>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})

export default CardDesignForm

// Nuevo componente para los inputs de color, logo e imagen
export const CardDesignInputs = ({ value, onChange, setLogoError, setHeroImageError, logoError, heroImageError }: any) => {
  const [logoName, setLogoName] = useState<string>("")
  const [heroImageName, setHeroImageName] = useState<string>("")
  const [iconName, setIconName] = useState<string>("")
  const { toast } = useToast()

  // Handlers de color
  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (e.target.type === 'color' && !/^#[0-9A-Fa-f]{6}$/.test(val)) {
      val = '#000000'
    }
    onChange({ ...value, primaryColor: val })
  }
  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (e.target.type === 'color' && !/^#[0-9A-Fa-f]{6}$/.test(val)) {
      val = '#ffffff'
    }
    onChange({ ...value, secondaryColor: val })
  }

  // Handlers de imagen
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 300 * 1024) {
        toast({ title: "Error", description: "El logo debe pesar máximo 300 KB" })
        return
      }
      if (!file.type.includes("png")) {
        toast({ title: "Error", description: "El logo debe ser PNG transparente" })
        return
      }
      setLogoError && setLogoError(null)
      setLogoName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }
  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "Error", description: "La imagen de fondo debe pesar máximo 1 MB" })
        return
      }
      if (!file.type.includes("jpeg") && !file.type.includes("png")) {
        toast({ title: "Error", description: "La imagen debe ser JPG o PNG" })
        return
      }
      setHeroImageError && setHeroImageError(null)
      setHeroImageName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, heroImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handler para icono de notificaciones
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024) {
        toast({ title: "Error", description: "El icono debe pesar máximo 100 KB" })
        return
      }
      if (!file.type.includes("png")) {
        toast({ title: "Error", description: "El icono debe ser PNG" })
        return
      }
      setIconName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ ...value, customStampImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="border rounded-xl p-8 max-w-4xl mx-auto mt-6 shadow-lg">
      {/* Header: pickers y checkbox */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex gap-8 items-end">
          <div className="flex flex-col items-center">
            <Label className="mb-1">Color del texto</Label>
            <Input type="color" value={value.secondaryColor || "#FFFFFF"} onChange={handleSecondaryColorChange} className="w-12 h-12 rounded-lg border-2 border-gray-300" />
            <Input type="text" value={value.secondaryColor || "#FFFFFF"} onChange={handleSecondaryColorChange} className="mt-2 w-24 text-center rounded-md" />
          </div>
          <div className="flex flex-col items-center">
            <Label className="mb-1">Color de fondo</Label>
            <Input type="color" value={value.primaryColor || "#000000"} onChange={handlePrimaryColorChange} className="w-12 h-12 rounded-lg border-2 border-gray-300" />
            <Input type="text" value={value.primaryColor || "#000000"} onChange={handlePrimaryColorChange} className="mt-2 w-24 text-center rounded-md" />
          </div>
        </div>
      </div>
      {/* Imágenes */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
        {/* Imagen fondo */}
        <div className="flex-1 text-center min-w-[180px]">
          <Label className="block mb-1 font-medium text-sm">Imagen Hero<span className="text-red-500">*</span><br /><span className="text-xs font-normal">(1024x256px, JPG/PNG, ≤1MB)</span></Label>
          <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Subir imagen</span>
              <input type="file" accept="image/png,image/jpeg" onChange={handleBgChange} className="hidden" />
            </label>
            {heroImageName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{heroImageName}</span>}
            {value.heroImage && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setHeroImageName(""); onChange({ ...value, heroImage: undefined }) }}>Quitar</Button>}
          </div>
          {heroImageError && <p className="text-red-500 text-xs mt-1">{heroImageError}</p>}
        </div>
        {/* Logo */}
        <div className="flex-1 text-center min-w-[180px]">
          <Label className="block mb-1 font-medium text-sm">Logo<span className="text-red-500">*</span><br /><span className="text-xs font-normal">(PNG transparente, ≤300KB, 600x600px)</span></Label>
          <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Subir logo</span>
              <input type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
            </label>
            {logoName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{logoName}</span>}
            {value.logo && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setLogoName(""); onChange({ ...value, logo: undefined }) }}>Quitar</Button>}
          </div>
          {logoError && <p className="text-red-500 text-xs mt-1">{logoError}</p>}
        </div>
        {/* Icono notificación (opcional) */}
        <div className="flex-1 text-center min-w-[180px]">
          <Label className="block mb-1 font-medium text-sm">Icono notificaciones<br /><span className="text-xs font-normal">(PNG, 100x100px, opcional)</span></Label>
          <div className="border-2 border-dashed rounded-lg p-3 min-h-[90px] flex flex-col items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Subir icono</span>
              <input type="file" accept="image/png" onChange={handleIconChange} className="hidden" />
            </label>
            {iconName && <span className="text-xs text-gray-600 truncate max-w-[120px] mt-1">{iconName}</span>}
            {value.customStampImage && <Button size="sm" variant="ghost" className="mt-1" onClick={() => { setIconName(""); onChange({ ...value, customStampImage: undefined }) }}>Quitar</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
