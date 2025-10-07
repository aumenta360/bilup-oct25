import { SaleDetails } from "../../../../components/sales/sale-detail"
import { getSalesByCustomer } from "../../../../services/sales-service"
import { notFound } from "next/navigation"

// Esta función es necesaria para rutas dinámicas cuando se usa 'export' en next.config.js
export async function generateStaticParams() {
  // En producción, podrías obtener todos los IDs de ventas
  // Para este ejemplo, solo devolvemos algunos IDs predefinidos
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

const SaleDetailsPage = async ({ params }: { params: { id: string } }) => {
  const sales = await getSalesByCustomer(params.id)

  if (!sales) {
    notFound()
  }

  return <SaleDetails sale={sales[0]} />
}

export default SaleDetailsPage;
