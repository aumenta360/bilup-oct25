export interface ICard {
  id: number;
  name: string;
  title: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  style: string;
  displayType: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCard {
  name: string;
  title: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  style?: string;
  displayType?: string;
  userId: number;
}

export interface IUpdateCard {
  name?: string;
  title?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  style?: string;
  displayType?: string;
  userId?: number;
} 