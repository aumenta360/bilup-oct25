import { type CardSettings, initialCardSettings } from "../types/card"

// Simulación de API para desarrollo
const STORAGE_KEY = "bilopapp_cards"

// Cargar tarjetas desde localStorage
const loadCards = (): CardSettings[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch (e) {
    console.error("Error loading cards from storage:", e)
    return []
  }
}

// Guardar tarjetas en localStorage
const saveCards = (cards: CardSettings[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

// Obtener todas las tarjetas
export const getAllCards = async (): Promise<CardSettings[]> => {
  // Simular llamada a API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadCards())
    }, 300)
  })
}

// Obtener una tarjeta por ID
export const getCardById = async (id: string): Promise<CardSettings | null> => {
  const cards = loadCards()
  const card = cards.find((c) => c.id === id)
  return card || null
}

// Crear una nueva tarjeta
export const createCard = async (name: string): Promise<CardSettings> => {
  const cards = loadCards()
  const newCard: CardSettings = {
    ...initialCardSettings,
    id: `card-${Date.now()}`,
    name,
  }

  cards.push(newCard)
  saveCards(cards)
  return newCard
}

// Actualizar una tarjeta
export const updateCard = async (card: CardSettings): Promise<CardSettings> => {
  const cards = loadCards()
  const index = cards.findIndex((c) => c.id === card.id)

  if (index >= 0) {
    cards[index] = card
    saveCards(cards)
    return card
  }

  throw new Error(`Card with ID ${card.id} not found`)
}

// Eliminar una tarjeta
export const deleteCard = async (id: string): Promise<void> => {
  const cards = loadCards()
  const filteredCards = cards.filter((c) => c.id !== id)

  if (filteredCards.length === cards.length) {
    throw new Error(`Card with ID ${id} not found`)
  }

  saveCards(filteredCards)
}

// Renombrar una tarjeta
export const renameCard = async (id: string, newName: string): Promise<CardSettings> => {
  const cards = loadCards()
  const index = cards.findIndex((c) => c.id === id)

  if (index >= 0) {
    cards[index].name = newName
    saveCards(cards)
    return cards[index]
  }

  throw new Error(`Card with ID ${id} not found`)
}
