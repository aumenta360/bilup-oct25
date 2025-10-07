export interface IReferral {
  id: number;
  referrerId: number;
  referredEmail: string;
  registered: boolean;
  registeredUserId?: number;
  createdAt: Date;
}

export interface ICreateReferral {
  referrerId: number;
  referredEmail: string;
}

export interface IUpdateReferral {
  registered?: boolean;
  registeredUserId?: number;
} 