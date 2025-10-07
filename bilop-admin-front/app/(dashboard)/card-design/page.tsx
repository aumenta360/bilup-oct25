"use client"

import CardTabs, { type Card as CardType } from "../../../components/card-tabs"
import { Tabs } from "../../../components/ui/tabs"
import { useState } from "react"
import AdvertisingDesign from "../../../components/advertising-design"
import CardOptions from "../../../components/card-options"
import Colors from "../../../components/colors"
import Images from "../../../components/images"
import Links from "../../../components/links"
import RegistrationPage from "../../../components/registration-page"

// Datos iniciales de ejemplo
const initialCards: CardType[] = [
  { id: "card-1", name: "Tarjeta Gold" },
  { id: "card-2", name: "Tarjeta Silver" },
]

const CardDesignerPage = () => {
  const [cards, setCards] = useState<CardType[]>(initialCards)
  const [activeCard, setActiveCard] = useState<string>(initialCards[0].id)
  const [activeTab, setActiveTab] = useState<string>("opciones")

  const handleCardAdd = (card: CardType) => {
    setCards([...cards, card])
    setActiveCard(card.id)
  }

  const handleCardRename = (cardId: string, newName: string) => {
    setCards(cards.map((card) => (card.id === cardId ? { ...card, name: newName } : card)))
  }

  const handleCardDelete = (cardId: string) => {
    const newCards = cards.filter((card) => card.id !== cardId)
    setCards(newCards)

    // Si se elimina la tarjeta activa, cambiar a la primera disponible
    if (cardId === activeCard && newCards.length > 0) {
      setActiveCard(newCards[0].id)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Diseñador de Tarjetas</h1>
        <p className="text-gray-500 dark:text-gray-400">Personaliza y gestiona tus tarjetas de fidelización</p>
      </div>

      <CardTabs
        cards={cards}
        activeCard={activeCard}
        onCardChange={setActiveCard}
        onCardAdd={handleCardAdd}
        onCardRename={handleCardRename}
        onCardDelete={handleCardDelete}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <div className="flex overflow-x-auto pb-2">
          <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-800 w-full">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "opciones"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("opciones")}
            >
              Opciones de Tarjeta
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "colores"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("colores")}
            >
              Colores
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "imagenes"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("imagenes")}
            >
              Imágenes
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "enlaces"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("enlaces")}
            >
              Enlaces
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "registro"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("registro")}
            >
              Página de Registro
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "diseno"
                  ? "border-b-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("diseno")}
            >
              Diseño Publicitario
            </button>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "opciones" && <CardOptions />}
          {activeTab === "colores" && <Colors />}
          {activeTab === "imagenes" && <Images />}
          {activeTab === "enlaces" && <Links />}
          {activeTab === "registro" && <RegistrationPage />}
          {activeTab === "diseno" && <AdvertisingDesign />}
        </div>
      </Tabs>
    </div>
  )
}

export default CardDesignerPage;
