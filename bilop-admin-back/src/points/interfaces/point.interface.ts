export interface IPoint {
  id: number;
  amount: number;
  description?: string;
  userId: number;
  pointTypeId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePoint {
  amount: number;
  description?: string;
  userId: number;
  pointTypeId: number;
}

export interface IUpdatePoint {
  amount?: number;
  description?: string;
  userId?: number;
  pointTypeId?: number;
}

export interface IPointType {
  id: number;
  name: string;
  description: string;
  value: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePointType {
  name: string;
  description: string;
  value: number;
  isActive?: boolean;
}

export interface IUpdatePointType {
  name?: string;
  description?: string;
  value?: number;
  isActive?: boolean;
} 