"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { loyaltyService } from "../../../services/loyalty-service"
import { Program } from "../../../types/loyalty"
import BasicDataForm from "../create/basic-data-form"
import CardDesignForm, { CardDesignInputs } from "../create/card-design-form"
import StampsConfigForm from "../create/stamps-config-form"
import TermsConditionForm from "../create/terms-condition-form"
import RewardsForm from "../create/rewards-form"
import ShareForm from "../create/share-form"
import PushMessage from "../create/push-message"
import DangerZone from "../create/danger-zone"
import { Button } from "../../../components/ui/button"
import { useToast } from "../../../hooks/use-toast"

const TABS = [
  { key: 'config', label: 'Configuración' },
  { key: 'rewards', label: 'Recompensas' },
  { key: 'share', label: 'Compartir' },
  { key: 'push', label: 'Mensajes Push' },
  { key: 'danger', label: 'Zona de Peligro' },
]

const EditProgramPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]["key"]>('config')
  const [loading, setLoading] = useState(true)
  const [program, setProgram] = useState<Program | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Refs para validación
  const nameRef = useRef<HTMLInputElement>(null);
  const requiredStampsRef = useRef<HTMLInputElement>(null);
  const preFilledStampsRef = useRef<HTMLInputElement>(null);
  const conditionsRef = useRef<HTMLTextAreaElement>(null);

  // Estados locales para cada bloque
  const [basicData, setBasicData] = useState({ name: '', active: true, description: '' })
  const [design, setDesign] = useState<any>({ primaryColor: '', secondaryColor: '', logo: '', heroImage: '', notificationIcon: '' })
  const [rules, setRules] = useState<any>({ stamps: {}, usageLimits: {} })
  const [conditions, setConditions] = useState('')
  const [rewards, setRewards] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [deletedLinks, setDeletedLinks] = useState<(number|string)[]>([])
  const [pushMessages, setPushMessages] = useState<any[]>([])

  const noop = () => {};

  // Cargar datos del programa y recompensas
  useEffect(() => {
    async function fetchProgram() {
      setLoading(true)
      try {
        const data = await loyaltyService.getProgramById(Number(params.id))
        setProgram(data)
        setBasicData({
          name: data.name,
          active: data.active,
          description: data.description || '',
        })
        setDesign({
          primaryColor: data.primaryColor || '',
          secondaryColor: data.secondaryColor || '',
          logo: data.logoImage || '',
          heroImage: data.backgroundImage || '',
        })
        setRules({
          stamps: {
            pointsPerPurchase: data.pointsPerPurchase,
            requiredStamps: data.requiredStamps,
            reward: data.reward,
            customStampIcon: data.customStampIcon || '🏪',
            customStampImage: data.stampImage || undefined,
            preFilledStamps: data.preFilledStamps || 0,
            onCompleteBehavior: data.onCompleteBehavior || 'unlimited',
          },
          usageLimits: data.usageLimits || {},
        })
        setConditions(data.termsAndConditions?.content || '')
        // Cargar recompensas reales
        const rewardsData = await loyaltyService.getRewards(Number(params.id))
        setRewards(rewardsData)
        // Cargar links reales
        const linksData = await loyaltyService.getShareLinks(Number(params.id))
        setLinks(linksData)
        // Cargar mensajes push reales
        const pushMessagesData = await loyaltyService.getPushMessages(Number(params.id))
        setPushMessages(pushMessagesData)
      } catch (e) {
        toast({ title: "Error", description: "No se pudo cargar el programa" })
        router.push('/loyalty')
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
    // eslint-disable-next-line
  }, [params.id])

  // Guardar cambios
  const handleSubmit = async () => {
    if (!program) return
    try {
      setLoading(true)
      const payload = {
        name: basicData.name,
        description: basicData.description,
        active: basicData.active,
        pointsPerPurchase: rules.stamps.pointsPerPurchase,
        requiredStamps: rules.stamps.requiredStamps,
        reward: rules.stamps.reward,
        primaryColor: design.primaryColor,
        textColor: design.secondaryColor,
        secondaryColor: design.secondaryColor,
        stampImage: rules.stamps.customStampImage,
        usageLimits: rules.usageLimits,
        termsAndConditions: { content: conditions },
      }
      await loyaltyService.updateProgram(Number(program.id), payload as any)

      // Sincronizar recompensas con el backend SOLO aquí
      // Obtener recompensas actuales del backend
      const current = await loyaltyService.getRewards(Number(program.id));
      // Eliminar recompensas que ya no existen
      for (const r of current) {
        if (!rewards.find(nr => nr.id === r.id)) {
          await loyaltyService.deleteReward(Number(program.id), r.id);
        }
      }
      // Crear o actualizar recompensas
      for (const r of rewards) {
        const payload: any = {
          title: r.title,
          requiredStamps: Number(r.requiredStamps),
          expirationDays: r.redeemDays ? Number(r.redeemDays) : undefined,
          pushEnabled: r.pushOnAchieve ?? true,
          redemptionNote: r.redemptionNote || undefined,
        };
        Object.keys(payload).forEach(k => (payload as any)[k] === undefined && delete (payload as any)[k]);
        if (!r.id || typeof r.id === 'string' || r.id > 2000000000) {
          await loyaltyService.createReward(Number(program.id), payload);
        } else {
          await loyaltyService.updateReward(Number(program.id), r.id, payload);
        }
      }
      // Recargar recompensas desde backend para reflejar ids reales
      const updated = await loyaltyService.getRewards(Number(program.id));
      setRewards(updated);

      // Sincronizar links con el backend SOLO aquí
      const currentLinks = await loyaltyService.getShareLinks(Number(program.id));
      console.log('Links actuales del backend:', currentLinks);
      // Eliminar links que ya no existen en el estado local
      for (const l of currentLinks) {
        if (!links.find(nl => nl.id === l.id)) {
          console.log('Eliminando link:', l.id);
          await loyaltyService.deleteShareLink(Number(program.id), l.id);
        }
      }
      // Crear o actualizar links
      for (const l of links) {
        const payload: any = {
          name: l.name,
        };
        if (!l.id || typeof l.id === 'string' || l.id > 2000000000) {
          await loyaltyService.createShareLink(Number(program.id), payload);
        } else {
          await loyaltyService.updateShareLink(Number(program.id), l.id, payload);
        }
      }
      // Recargar links desde backend para reflejar ids reales
      const updatedLinks = await loyaltyService.getShareLinks(Number(program.id));
      console.log('Links actualizados del backend:', updatedLinks);
      setLinks(updatedLinks);

      // Sincronizar mensajes push con el backend SOLO aquí
      const currentPushMessages = await loyaltyService.getPushMessages(Number(program.id));
      console.log('Mensajes push actuales del backend:', currentPushMessages);
      // Eliminar mensajes push que ya no existen en el estado local
      for (const pm of currentPushMessages) {
        if (!pushMessages.find(npm => npm.id === pm.id)) {
          console.log('Eliminando mensaje push:', pm.id);
          await loyaltyService.deletePushMessage(Number(program.id), pm.id);
        }
      }
      // Crear o actualizar mensajes push
      for (const pm of pushMessages) {
        const payload: any = {
          title: pm.title,
          message: pm.message,
        };
        if (!pm.id || typeof pm.id === 'string' || pm.id > 2000000000) {
          await loyaltyService.createPushMessage(Number(program.id), payload);
        } else {
          await loyaltyService.updatePushMessage(Number(program.id), pm.id, payload);
        }
      }
      // Recargar mensajes push desde backend para reflejar ids reales
      const updatedPushMessages = await loyaltyService.getPushMessages(Number(program.id));
      console.log('Mensajes push actualizados del backend:', updatedPushMessages);
      setPushMessages(updatedPushMessages);

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.refresh();
      }, 2500);
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar el programa" })
    } finally {
      setLoading(false)
    }
  }

  const handleRewardsChange = (newRewards: any[]) => {
    setRewards(newRewards);
  };

  const handleLinksChange = (newLinks: any[]) => {
    // Detectar links eliminados
    const removed = links.filter(l => !newLinks.find(nl => nl.id === l.id));
    const removedIds = removed.filter(l => l.id && typeof l.id === 'number').map(l => l.id);
    if (removedIds.length > 0) setDeletedLinks(prev => [...prev, ...removedIds]);
    setLinks(newLinks);
  };

  const handlePushMessagesChange = (newPushMessages: any[]) => {
    setPushMessages(newPushMessages);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!program) return null

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          aria-label="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>
        <h1 className="text-2xl font-bold">Edición de Programa</h1>
      </div>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors duration-150 ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab(tab.key as typeof TABS[number]["key"])}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === 'config' && (
        <>
          <div className="space-y-6">
            <BasicDataForm value={basicData} onChange={setBasicData} nameRef={nameRef} />
            <CardDesignInputs
              value={design}
              onChange={setDesign}
            />
            <StampsConfigForm value={rules} onChange={setRules} requiredStampsRef={requiredStampsRef} preFilledStampsRef={preFilledStampsRef} />
            <TermsConditionForm value={conditions} onChange={setConditions} conditionsRef={conditionsRef} />
          </div>
          {/* Wallet sticky solo en pantallas grandes */}
          <div className="hidden lg:block">
            <div className="fixed right-2 top-32 w-96 z-40" style={{ maxWidth: 400 }}>
              <CardDesignForm
                value={{
                  ...design,
                  totalStamps: rules.stamps.requiredStamps,
                  preFilledStamps: rules.stamps.preFilledStamps,
                  customStampIcon: rules.stamps.customStampIcon,
                  customStampImage: rules.stamps.customStampImage,
                }}
                onChange={setDesign}
                setLogoError={noop}
                setHeroImageError={noop}
                logoError={null}
                heroImageError={null}
                previewOnly
              />
            </div>
          </div>
        </>
      )}
      {activeTab === 'rewards' && (
        <RewardsForm
          value={rewards}
          onChange={handleRewardsChange}
          programId={Number(params.id)}
        />
      )}
      {activeTab === 'share' && (
        <ShareForm
          links={links}
          onChange={handleLinksChange}
          programId={Number(params.id)}
        />
      )}
      {activeTab === 'push' && (
        <PushMessage
          value={pushMessages}
          onChange={handlePushMessagesChange}
          programId={Number(params.id)}
        />
      )}
      {activeTab === 'danger' && (
        <DangerZone
          programId={Number(params.id)}
          currentExpiration={program.expirationConfig}
        />
      )}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.back()}>Atrás</Button>
        <Button variant="outline" onClick={handleSubmit}>Guardar Cambios</Button>
      </div>
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">¡Programa actualizado correctamente!</h2>
            <p className="text-gray-700">La página se actualizará en un momento...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProgramPage;