"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Plus, X, Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

// Tipo para representar una tarjeta
export interface Card {
  id: string
  name: string
}

interface CardTabsProps {
  cards: Card[]
  activeCard: string
  onCardChange: (cardId: string) => void
  onCardAdd: (card: Card) => void
  onCardRename: (cardId: string, newName: string) => void
  onCardDelete: (cardId: string) => void
}

const CardTabs = ({ cards, activeCard, onCardChange, onCardAdd, onCardRename, onCardDelete }: CardTabsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newCardName, setNewCardName] = useState("")
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)
  const [cardToRename, setCardToRename] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const handleAddCard = () => {
    if (newCardName.trim()) {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        name: newCardName,
      }
      onCardAdd(newCard)
      setNewCardName("")
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteCard = () => {
    if (cardToDelete) {
      onCardDelete(cardToDelete)
      setCardToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleRenameCard = () => {
    if (cardToRename && newName.trim()) {
      onCardRename(cardToRename, newName)
      setCardToRename(null)
      setNewName("")
      setIsRenameDialogOpen(false)
    }
  }

  const openDeleteDialog = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCardToDelete(cardId)
    setIsDeleteDialogOpen(true)
  }

  const openRenameDialog = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation()
    setCardToRename(card.id)
    setNewName(card.name)
    setIsRenameDialogOpen(true)
  }

  return (
    <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
      <Tabs value={activeCard} className="w-full">
        <TabsList className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center">
              <TabsTrigger
                value={card.id}
                onClick={() => onCardChange(card.id)}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-amber-500 dark:data-[state=active]:text-black"
              >
                {card.name}
              </TabsTrigger>
              <div className="flex space-x-1 ml-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => openRenameDialog(card, e)}>
                  <Edit2 className="h-3 w-3" />
                  <span className="sr-only">Renombrar</span>
                </Button>
                {cards.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={(e) => openDeleteDialog(card.id, e)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Agregar tarjeta</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar nueva tarjeta</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="card-name">Nombre de la tarjeta</Label>
                <Input
                  id="card-name"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Ej: Tarjeta Gold"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleAddCard}>Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsList>
      </Tabs>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar tarjeta?</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteCard}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para renombrar */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar tarjeta</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-name">Nuevo nombre</Label>
            <Input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleRenameCard}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CardTabs;