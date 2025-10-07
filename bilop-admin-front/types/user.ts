export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  company: string
  role: "admin" | "usuario"
  createdAt: string
  avatar?: string
}
