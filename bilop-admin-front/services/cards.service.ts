import { api } from './api.service';

export interface Card {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardDto {
  name: string;
  description: string;
  userId: number;
}

export interface CardImages {
  id: number;
  cardId: number;
  logo: string;
  background: string;
  qrCode: string;
}

export const cardsService = {
  async getAll(): Promise<Card[]> {
    return api.get<Card[]>('/cards');
  },

  async getById(id: number): Promise<Card> {
    return api.get<Card>(`/cards/${id}`);
  },

  async create(card: CreateCardDto): Promise<Card> {
    return api.post<Card>('/cards', card);
  },

  async update(id: number, card: Partial<CreateCardDto>): Promise<Card> {
    return api.patch<Card>(`/cards/${id}`, card);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/cards/${id}`);
  },

  async getImages(cardId: number): Promise<CardImages> {
    return api.get<CardImages>(`/cards/${cardId}/images`);
  },

  async uploadImage(cardId: number, type: string, file: File): Promise<CardImages> {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<CardImages>(`/cards/${cardId}/images/${type}`, formData);
  }
};
