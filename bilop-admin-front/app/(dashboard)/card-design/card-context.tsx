"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { CardSettings } from "../../../types/card"
import { getAllCards, createCard, updateCard, deleteCard, renameCard } from "../../../services/cards-service"

interface CardContextType {
  cards: CardSettings[]
  activeCardId: string | null
  activeCard: CardSettings | null
  loading: boolean
  error: string | null
  setActiveCardId: (id: string) => void
  addCard: (name: string) => Promise<void>
  updateCardSettings: (settings: Partial<CardSettings>) => Promise<void>
  removeCard: (id: string) => Promise<void>
  changeCardName: (id: string, newName: string) => Promise<void>
}

const CardContext = createContext<CardContextType | undefined>(undefined)

const CardProvider = ({ children }: { children: React.ReactNode }) => {
  const [cards, setCards] = useState<CardSettings[]>([])
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener la tarjeta activa
  const activeCard = activeCardId ? cards.find((card) => card.id === activeCardId) || null : null

  // Cargar tarjetas al inicio
  useEffect(() => {
    const loadInitialCards = async () => {
      try {
        setLoading(true)
        const loadedCards = await getAllCards()

        setCards(loadedCards)

        // Si hay tarjetas, establecer la primera como activa
        if (loadedCards.length > 0) {
          setActiveCardId(loadedCards[0].id)
        } else {
          // Si no hay tarjetas, crear una por defecto
          const newCard = await createCard("Tarjeta Default")
          setCards([newCard])
          setActiveCardId(newCard.id)
        }
      } catch (err) {
        setError("Error al cargar las tarjetas")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialCards()
  }, [])

  // Añadir una nueva tarjeta
  const addCard = async (name: string) => {
    try {
      const newCard = await createCard(name)
      setCards((prev) => [...prev, newCard])
      setActiveCardId(newCard.id)
    } catch (err) {
      setError("Error al crear la tarjeta")
      console.error(err)
    }
  }

  // Actualizar configuración de la tarjeta activa
  const updateCardSettings = async (settings: Partial<CardSettings>) => {
    if (!activeCard) return

    try {
      const updatedCard = await updateCard({
        ...activeCard,
        ...settings,
      })

      setCards((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
    } catch (err) {
      setError("Error al actualizar la tarjeta")
      console.error(err)
    }
  }

  // Eliminar una tarjeta
  const removeCard = async (id: string) => {
    try {
      await deleteCard(id)

      const updatedCards = cards.filter((card) => card.id !== id)
      setCards(updatedCards)

      // Si se elimina la tarjeta activa, cambiar a otra
      if (id === activeCardId && updatedCards.length > 0) {
        setActiveCardId(updatedCards[0].id)
      } else if (updatedCards.length === 0) {
        // Si no quedan tarjetas, crear una nueva
        const newCard = await createCard("Nueva Tarjeta")
        setCards([newCard])
        setActiveCardId(newCard.id)
      }
    } catch (err) {
      setError("Error al eliminar la tarjeta")
      console.error(err)
    }
  }

  // Cambiar el nombre de una tarjeta
  const changeCardName = async (id: string, newName: string) => {
    try {
      const updatedCard = await renameCard(id, newName)

      setCards((prev) => prev.map((card) => (card.id === id ? { ...card, name: newName } : card)))
    } catch (err) {
      setError("Error al renombrar la tarjeta")
      console.error(err)
    }
  }

  const value = {
    cards,
    activeCardId,
    activeCard,
    loading,
    error,
    setActiveCardId,
    addCard,
    updateCardSettings,
    removeCard,
    changeCardName,
  }

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>
}

const useCardContext = () => {
  const context = useContext(CardContext)
  if (context === undefined) {
    throw new Error("useCardContext must be used within a CardProvider")
  }
  return context
}

export default { CardProvider, useCardContext };
