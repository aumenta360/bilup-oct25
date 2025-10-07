"use client"

import { useState } from "react"
import { User } from "../../../.../../types/user"

// Datos mockeados para la página de usuarios
const mockUsers: User[] = [
  {
    id: "1",
    name: "Juan",
    lastName: "Pérez",
    email: "juan@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 1",
  },
  {
    id: "2",
    name: "María",
    lastName: "García",
    email: "maria@ejemplo.com",
    role: "usuario",
    createdAt: new Date().toISOString(),
    company: "Empresa 2",
  },
  {
    id: "3",
    name: "Carlos",
    lastName: "López",
    email: "carlos@ejemplo.com",
    role: "usuario",
    createdAt: new Date().toISOString(),
    company: "Empresa 3",
  },
  {
    id: "4",
    name: "Ana",
    lastName: "Rodríguez",
    email: "ana@ejemplo.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    company: "Empresa 4",
  },
  {
    id: "5",
    name: "Pedro",
    lastName: "Martínez",
    email: "pedro@ejemplo.com",
    role: "usuario",
    createdAt: new Date().toISOString(),
    company: "Empresa 5",
  }
];

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(false) // Iniciamos como false ya que usamos datos mockeados
  const [error, setError] = useState("")

  // No necesitamos useEffect ni loadUsers ya que estamos usando datos mockeados directamente

  const handleDelete = (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return

    try {
      // Simulamos la eliminación actualizando el estado local
      setUsers(users.filter(user => user.id !== userId))
    } catch (err) {
      setError("Error al eliminar el usuario")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuarios</h1>
        <button className="px-4 py-2 bg-blue-600 dark:bg-amber-500 text-white dark:text-black rounded hover:bg-blue-700 dark:hover:bg-amber-600 transition-colors">
          Añadir Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 transition-colors mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 

export default UsersPage;