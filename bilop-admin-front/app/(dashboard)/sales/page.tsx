import SalesSummary from "../../../components/sales/sales-summary"
import { salesService } from "../../../services/sales-service"

const SalesPage = async () => {
  const summary = await salesService.getSalesSummary()

  return <SalesSummary summary={summary as any} />
}
export default SalesPage;

