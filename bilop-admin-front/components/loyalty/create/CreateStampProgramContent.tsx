"use client"

import { Button } from '../../../components/ui/button';
import { loyaltyService } from '../../../services/loyalty-service';
import { useRouter } from 'next/navigation';
import BasicDataForm from './basic-data-form';
import CardDesignForm, { CardDesignInputs } from './card-design-form';
import StampsConfigForm from './stamps-config-form';
import TermsConditionForm from './terms-condition-form';
import RewardsForm from './rewards-form';
import ShareForm from './share-form';
import PushMessage from './push-message';
import React, { useRef } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from "@/providers/AuthProvider";

const TABS = [
  { key: 'config', label: 'Configuración' },
  { key: 'rewards', label: 'Recompensas' },
  { key: 'share', label: 'Compartir' },
  { key: 'push', label: 'Mensajes Push' },
];

const CreateStampProgramContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'config' | 'rewards' | 'share' | 'push'>('config');
  const [createdProgramId, setCreatedProgramId] = React.useState<number | null>(null);

  // Refs para los campos requeridos
  const nameInputRef = useRef<HTMLInputElement>(null);
  const requiredStampsInputRef = useRef<HTMLInputElement>(null);
  const preFilledStampsInputRef = useRef<HTMLInputElement>(null);
  const conditionsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const cardDesignFormRef = useRef<HTMLDivElement>(null);

  // Estados locales para cada bloque
  const [basicData, setBasicData] = React.useState({ name: '', active: true, description: '' });
  const [design, setDesign] = React.useState<any>({
    primaryColor: '#040404',
    secondaryColor: '#eeeeee',
    logo: '',
    heroImage: '',
  });
  const [rules, setRules] = React.useState<any>({
    stamps: {
      requiredStamps: 10,
      preFilledStamps: 0,
      onCompleteBehavior: 'unlimited',
      customStampIcon: '🏪',
      customStampImage: undefined,
      pointsPerPurchase: 1,
      reward: "Recompensa de ejemplo",
    },
    usageLimits: {
      enabled: false,
      maxUses: 1,
      period: 'day'
    }
  });
  const [conditions, setConditions] = React.useState('');
  const [rewards, setRewards] = React.useState<any[]>([]);
  const [links, setLinks] = React.useState<any[]>([]);
  const [pushMessages, setPushMessages] = React.useState<any[]>([]);

  // Estados de error para CardDesignForm
  const [cardDesignLogoError, setCardDesignLogoError] = React.useState<string | null>(null);
  const [cardDesignHeroImageError, setCardDesignHeroImageError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setCardDesignLogoError(null);
      setCardDesignHeroImageError(null);
      setNameError(null);

      // Validaciones de campos requeridos y scroll
      if (!basicData.name.trim()) {
        setActiveTab('config');
        nameInputRef.current?.focus();
        nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setNameError('El nombre del programa es obligatorio.');
        return;
      }
      if (rules.stamps.requiredStamps > 20) {
        setActiveTab('config');
        requiredStampsInputRef.current?.focus();
        requiredStampsInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast({ title: "Error", description: "El número total de estampillas debe ser como máximo 20." });
        return;
      }
      if (rules.stamps.preFilledStamps < 0 || rules.stamps.preFilledStamps >= rules.stamps.requiredStamps) {
        setActiveTab('config');
        preFilledStampsInputRef.current?.focus();
        preFilledStampsInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast({ title: "Error", description: "Las estampillas pre-llenadas deben ser 0 o menor que el total de estampillas." });
        return;
      }
      if (!conditions || conditions.length < 10) {
        setActiveTab('config');
        conditionsTextareaRef.current?.focus();
        conditionsTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast({ title: "Error", description: "Los términos y condiciones deben tener al menos 10 caracteres" });
        return;
      }
      if (!design.logo) {
        setActiveTab('config');
        setCardDesignLogoError('El logo es obligatorio.');
        cardDesignFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!design.heroImage) {
        setActiveTab('config');
        setCardDesignHeroImageError('La imagen de fondo es obligatoria.');
        cardDesignFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Preparar datos básicos del programa
      const programData = {
        name: basicData.name,
        description: basicData.description || "Sin descripción",
        type: "stamps",
        pointsPerPurchase: rules.stamps.pointsPerPurchase,
        requiredStamps: rules.stamps.requiredStamps,
        reward: rules.stamps.reward,
        preFilledStamps: rules.stamps.preFilledStamps,
        onCompleteBehavior: rules.stamps.onCompleteBehavior,
        customStampIcon: rules.stamps.customStampIcon,
        primaryColor: design.primaryColor,
        textColor: design.secondaryColor,
        secondaryColor: design.secondaryColor,
        logoImage: design.logo,
        backgroundImage: design.heroImage,
        stampImage: rules.stamps.customStampImage,
        usageLimits: {
          enabled: rules.usageLimits.enabled,
          period: rules.usageLimits.period,
          maxUses: rules.usageLimits.maxUses
        },
        termsAndConditions: { content: conditions },
        rewards: [],
      };

      // 1. Crear programa
      let created;
      try {
        created = await loyaltyService.createProgram(programData as any);
      } catch (error: any) {
        // Verificamos si el error es de nombre duplicado
        const backendMessage =
          error?.response?.data?.message ||
          error?.message ||
          (typeof error === "string" ? error : "");

        if (
          backendMessage === "Ya existe un programa con este nombre" ||
          backendMessage?.includes("Ya existe un programa con este nombre")
        ) {
          setActiveTab("config");
          setNameError("Este nombre ya existe.");
          nameInputRef.current?.focus();
          nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          // IMPORTANTE: retornamos aquí para que NO se propague el error al catch global
          return;
        }
        // Si no es el error esperado, lo lanzamos para que lo maneje el catch global
        throw error;
      }
      if (!created || !created.id) {
        throw new Error('No se pudo crear el programa');
      }
      setCreatedProgramId(created.id);

      // 2. Crear rewards secuencialmente
      for (const item of rewards) {
        const payload = {
          title: item.title,
          requiredStamps: Number(item.requiredStamps),
          expirationDays: item.redeemDays ? Number(item.redeemDays) : undefined,
          pushEnabled: item.pushOnAchieve ?? true,
          redemptionNote: item.redemptionNote || undefined,
        };
        // Limpiar campos undefined de forma typesafe
        const cleanPayload = Object.entries(payload).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            (acc as any)[key] = value;
          }
          return acc;
        }, {} as typeof payload);
        console.log('POST /rewards payload:', cleanPayload);
        await loyaltyService.createReward(created.id, cleanPayload);
      }

      // 3. Crear links secuencialmente
      for (const item of links) {
        await loyaltyService.createShareLink(created.id, { name: item.name });
      }

      // 5. Crear push messages secuencialmente
      for (const item of pushMessages) {
        const payload = {
          title: item.title,
          message: item.message,
          origins: item.origins,
          exactStamps: Number(item.stamps) || 0,
        };
        if (item.scheduled && item.date) {
          (payload as any).scheduledAt = item.date;
        }
        await loyaltyService.createPushMessage(created.id, payload);
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/loyalty');
      }, 2500);
    } catch (error) {
      console.error('Error al crear el programa:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Error al crear el programa" 
      });
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          aria-label="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        </button>
        <h1 className="text-2xl font-bold">Crear Nuevo Programa</h1>
      </div>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-6 py-2 font-medium border-b-2 transition-colors duration-150 ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab(tab.key as 'config' | 'rewards' | 'share' | 'push')}
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
            <BasicDataForm value={basicData} onChange={setBasicData} nameRef={nameInputRef} nameError={nameError} />
            <CardDesignInputs
              value={design}
              onChange={setDesign}
              setLogoError={setCardDesignLogoError}
              setHeroImageError={setCardDesignHeroImageError}
              logoError={cardDesignLogoError}
              heroImageError={cardDesignHeroImageError}
            />
            <StampsConfigForm value={rules} onChange={setRules} requiredStampsRef={requiredStampsInputRef} preFilledStampsRef={preFilledStampsInputRef} />
            <TermsConditionForm value={conditions} onChange={setConditions} conditionsRef={conditionsTextareaRef} />
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
                ref={cardDesignFormRef}
                setLogoError={setCardDesignLogoError}
                setHeroImageError={setCardDesignHeroImageError}
                logoError={cardDesignLogoError}
                heroImageError={cardDesignHeroImageError}
                previewOnly
              />
            </div>
          </div>
        </>
      )}
      {activeTab === 'rewards' && (
        <RewardsForm value={rewards} onChange={setRewards} />
      )}
      {activeTab === 'share' && (
        <ShareForm links={links} onChange={setLinks} />
      )}
      {activeTab === 'push' && (
        <PushMessage
          programId={createdProgramId || undefined}
          value={pushMessages}
          onChange={setPushMessages}
        />
      )}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.back()}>Atrás</Button>
        <Button variant="outline" onClick={handleSubmit}>Crear Programa</Button>
      </div>
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">¡Programa creado exitosamente!</h2>
            <p className="text-gray-700">Serás redirigido en un momento...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStampProgramContent; 