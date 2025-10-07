import SalesHistory from "../../../../components/sales/sales-history"
import { salesService } from "../../../../services/sales-service"

const SalesHistoryPage = async () => {
  try {
    const sales = await salesService.getSales()
    return <SalesHistory sales={sales} />
  } catch (error) {
    console.error("Error loading sales:", error)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sales History</h1>
        <div className="text-red-500">Error loading sales. Please try again later.</div>
      </div>
    )
  }
}

export default SalesHistoryPage;
