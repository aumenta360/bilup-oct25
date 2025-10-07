export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  registrationDate: string
  active: boolean
  level: string
  progress: number
  balance: number
  programId: string
  birthDate?: string
  address?: string
  city?: string
  notes?: string
}

export interface Segment {
  id: string
  name: string
  description: string
  customers: number
  averageValue: number
  color: string
  percentage: number
}
