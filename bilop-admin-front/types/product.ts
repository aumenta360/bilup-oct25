export interface Product {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  categoriaId: string
  categoriaNombre: string
  precio: number
  precioOferta?: number
  ofertaActiva: boolean
  stock: number
  stockMinimo: number
  unidadMedida: string
  imagenes: string[]
  estado: EstadoProducto
  fechaCreacion: string
  fechaActualizacion: string
  atributos: AtributoProducto[]
  puntosOtorga?: number
}

export type EstadoProducto = "activo" | "inactivo" | "agotado" | "descontinuado"

export interface AtributoProducto {
  nombre: string
  valor: string
}

export interface CategoriaProducto {
  id: string
  nombre: string
  descripcion?: string
  imagenUrl?: string
  productosCount: number
}

export interface FiltrosProducto {
  categoriaId?: string
  busqueda?: string
  precioMin?: number
  precioMax?: number
  soloOfertas?: boolean
  soloConStock?: boolean
  estado?: EstadoProducto
}

export interface InventorySummary {
  totalItems: number
  inventoryValue: number
}
