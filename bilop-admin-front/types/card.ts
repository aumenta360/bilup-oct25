// Modelo de datos para tarjetas
export interface CardSettings {
    id: string
    name: string
  
    // Opciones de Tarjeta
    cardName: string
    showBarcode: boolean
    scanText: string
    promotionType: "icons" | "text"
    stampIcon: string
    rewardIcon: string
    cardTitle: string
    frontDescription: string
    backDescription: string
  
    // Colores
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  
    // Imágenes
    squareLogo: string | null
    horizontalLogo: string | null
    coverImage: string | null
    registrationCoverImage: string | null
  
    // Enlaces
    links: {
      title: string
      url: string
    }[]
  
    // Página de Registro
    registrationPageName: string
    circularLogo: string | null
    fields: {
      name: string
      type: string
      visible: boolean
      required: boolean
    }[]
  
    // Diseño Publicitario
    templateId: string
  }
  
  // Estado inicial para una nueva tarjeta
  export const initialCardSettings: Omit<CardSettings, "id" | "name"> = {
    // Opciones de Tarjeta
    cardName: "Nueva Tarjeta",
    showBarcode: true,
    scanText: "Escanea para obtener puntos",
    promotionType: "icons",
    stampIcon: "star",
    rewardIcon: "gift",
    cardTitle: "CLUB VIP",
    frontDescription: "Tarjeta de fidelización",
    backDescription: "Disfruta de beneficios exclusivos y acumula puntos con cada compra.",
  
    // Colores
    primaryColor: "#3B82F6",
    secondaryColor: "#1E293B",
    backgroundColor: "#FFFFFF",
  
    // Imágenes
    squareLogo: null,
    horizontalLogo: null,
    coverImage: null,
    registrationCoverImage: null,
  
    // Enlaces
    links: [],
  
    // Página de Registro
    registrationPageName: "Registro",
    circularLogo: null,
    fields: [
      { name: "Nombre", type: "text", visible: true, required: true },
      { name: "Apellido", type: "text", visible: true, required: true },
      { name: "Email", type: "email", visible: true, required: true },
      { name: "Teléfono", type: "tel", visible: true, required: false },
      { name: "Fecha de cumpleaños", type: "date", visible: true, required: false },
      { name: "Género", type: "select", visible: true, required: false },
    ],
  
    // Diseño Publicitario
    templateId: "template-1",
  }
  