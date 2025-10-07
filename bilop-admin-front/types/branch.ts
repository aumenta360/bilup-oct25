export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  active: boolean
  openingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}
