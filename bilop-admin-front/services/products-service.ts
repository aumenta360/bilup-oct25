import type { Product } from "../types/product"

// Mock data to simulate API
const productsMock: Product[] = [
  {
    id: '501',
    codigo: 'SP-001',
    nombre: 'Smartphone XYZ',
    descripcion: 'Latest generation smartphone with 128GB storage and 8GB RAM',
    categoriaId: '1',
    categoriaNombre: 'Smartphones',
    precio: 1200,
    precioOferta: undefined,
    ofertaActiva: false,
    stock: 25,
    stockMinimo: 5,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-04-20T14:30:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'XYZ' },
      { nombre: 'Model', valor: 'Pro Max' },
      { nombre: 'Color', valor: 'Black' }
    ],
    puntosOtorga: 120
  },
  {
    id: '502',
    codigo: 'LT-001',
    nombre: 'Laptop ABC',
    descripcion: 'Work and gaming laptop with latest generation processor',
    categoriaId: '2',
    categoriaNombre: 'Laptops',
    precio: 1800,
    precioOferta: 1620,
    ofertaActiva: true,
    stock: 12,
    stockMinimo: 3,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-02-10T09:15:00Z',
    fechaActualizacion: '2024-05-01T11:45:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'ABC' },
      { nombre: 'Model', valor: 'Gaming Pro' },
      { nombre: 'Processor', valor: 'Intel i7' },
      { nombre: 'RAM', valor: '16GB' },
      { nombre: 'Storage', valor: '512GB SSD' }
    ],
    puntosOtorga: 180
  },
  {
    id: '503',
    codigo: 'MS-001',
    nombre: 'Wireless Mouse',
    descripcion: 'Ergonomic wireless mouse with long battery life',
    categoriaId: '3',
    categoriaNombre: 'Accessories',
    precio: 50,
    precioOferta: undefined,
    ofertaActiva: false,
    stock: 50,
    stockMinimo: 10,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-02-20T13:30:00Z',
    fechaActualizacion: '2024-04-15T10:20:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'Tech' },
      { nombre: 'Model', valor: 'Ergo Plus' },
      { nombre: 'Color', valor: 'Black' },
      { nombre: 'Connectivity', valor: 'Bluetooth' }
    ],
    puntosOtorga: 5
  },
  {
    id: '504',
    codigo: 'AUD-001',
    nombre: 'Bluetooth Headphones',
    descripcion: 'Wireless headphones with noise cancellation',
    categoriaId: '3',
    categoriaNombre: 'Accessories',
    precio: 120,
    precioOferta: undefined,
    ofertaActiva: false,
    stock: 30,
    stockMinimo: 8,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-03-05T15:45:00Z',
    fechaActualizacion: '2024-04-25T09:10:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'SoundMax' },
      { nombre: 'Model', valor: 'Pro Noise Cancel' },
      { nombre: 'Color', valor: 'White' },
      { nombre: 'Battery', valor: '20 hours' }
    ],
    puntosOtorga: 12
  },
  {
    id: '505',
    codigo: 'TB-001',
    nombre: '10" Tablet',
    descripcion: '10-inch tablet with HD display and octa-core processor',
    categoriaId: '4',
    categoriaNombre: 'Tablets',
    precio: 800,
    precioOferta: 720,
    ofertaActiva: true,
    stock: 18,
    stockMinimo: 5,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-03-15T11:20:00Z',
    fechaActualizacion: '2024-05-02T14:15:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'TabTech' },
      { nombre: 'Model', valor: 'T10 Pro' },
      { nombre: 'Storage', valor: '64GB' },
      { nombre: 'RAM', valor: '4GB' },
      { nombre: 'Color', valor: 'Gray' }
    ],
    puntosOtorga: 80
  },
  {
    id: '506',
    codigo: 'IMP-001',
    nombre: 'All-in-One Printer',
    descripcion: 'Printer, scanner and copier all in one with WiFi connectivity',
    categoriaId: '5',
    categoriaNombre: 'Printers',
    precio: 450,
    precioOferta: undefined,
    ofertaActiva: false,
    stock: 10,
    stockMinimo: 3,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-03-25T10:30:00Z',
    fechaActualizacion: '2024-04-30T16:40:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'PrintAll' },
      { nombre: 'Model', valor: 'Multi Pro' },
      { nombre: 'Type', valor: 'Inkjet' },
      { nombre: 'Connectivity', valor: 'WiFi, USB' }
    ],
    puntosOtorga: 45
  },
  {
    id: '507',
    codigo: 'TV-001',
    nombre: '55" Smart TV',
    descripcion: '55-inch Smart TV with 4K resolution and Android TV operating system',
    categoriaId: '6',
    categoriaNombre: 'TVs',
    precio: 1500,
    precioOferta: 1350,
    ofertaActiva: true,
    stock: 8,
    stockMinimo: 2,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'activo',
    fechaCreacion: '2024-04-05T09:45:00Z',
    fechaActualizacion: '2024-05-03T13:20:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'ViewMax' },
      { nombre: 'Model', valor: 'UHD 55' },
      { nombre: 'Resolution', valor: '4K' },
      { nombre: 'Operating System', valor: 'Android TV' }
    ],
    puntosOtorga: 150
  },
  {
    id: '508',
    codigo: 'CAM-001',
    nombre: 'Digital Camera',
    descripcion: 'Professional digital camera with interchangeable lens',
    categoriaId: '7',
    categoriaNombre: 'Cameras',
    precio: 900,
    precioOferta: undefined,
    ofertaActiva: false,
    stock: 0,
    stockMinimo: 2,
    unidadMedida: 'unit',
    imagenes: ['/placeholder.svg?height=300&width=300'],
    estado: 'agotado',
    fechaCreacion: '2024-04-10T14:15:00Z',
    fechaActualizacion: '2024-05-04T10:30:00Z',
    atributos: [
      { nombre: 'Brand', valor: 'PhotoPro' },
      { nombre: 'Model', valor: 'DSLR X3' },
      { nombre: 'Megapixels', valor: '24MP' },
      { nombre: 'Type', valor: 'DSLR' }
    ],
    puntosOtorga: 90
  }
]

// Get all products
export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return productsMock
}

// Get product by ID
export async function getProduct(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return productsMock.find((p) => p.id === id) || null
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return productsMock.filter((p) => p.categoriaId === categoryId)
}

// Create a new product
export async function createProduct(data: Partial<Product>): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newProduct: Product = {
    id: Math.floor(Math.random() * 1000).toString(),
    codigo: data.codigo || "",
    nombre: data.nombre || "",
    descripcion: data.descripcion || "",
    categoriaId: data.categoriaId || "",
    categoriaNombre: data.categoriaNombre || "",
    precio: data.precio || 0,
    precioOferta: data.precioOferta,
    ofertaActiva: data.ofertaActiva || false,
    stock: data.stock || 0,
    stockMinimo: data.stockMinimo || 0,
    unidadMedida: data.unidadMedida || "unit",
    imagenes: data.imagenes || ['/placeholder.svg?height=300&width=300'],
    estado: data.estado || "activo",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    atributos: data.atributos || [],
    puntosOtorga: data.puntosOtorga || 0
  }

  // In a real application, this would be saved to the database
  productsMock.push(newProduct)

  return newProduct
}

// Update an existing product
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const index = productsMock.findIndex((p) => p.id === id)
  if (index === -1) return null

  // Update product with new data
  productsMock[index] = {
    ...productsMock[index],
    ...data,
    fechaActualizacion: new Date().toISOString()
  }

  return productsMock[index]
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = productsMock.findIndex((p) => p.id === id)
  if (index === -1) return false

  productsMock.splice(index, 1)
  return true
}

// Get product categories
export async function getCategories(): Promise<{ id: string; name: string }[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    { id: '1', name: 'Smartphones' },
    { id: '2', name: 'Laptops' },
    { id: '3', name: 'Accessories' },
    { id: '4', name: 'Tablets' },
    { id: '5', name: 'Printers' },
    { id: '6', name: 'TVs' },
    { id: '7', name: 'Cameras' }
  ]
}
