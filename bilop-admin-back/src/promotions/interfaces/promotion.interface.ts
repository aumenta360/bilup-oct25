export interface IPromotion {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  pointMultiplier: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePromotion {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  pointMultiplier: number;
  isActive?: boolean;
}

export interface IUpdatePromotion {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  pointMultiplier?: number;
  isActive?: boolean;
} 