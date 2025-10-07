import { branchesService } from "../../../../services/branches-service"
import { getCustomers } from "../../../../services/customers-service"
import { getProducts } from "../../../../services/products-service"
import NewSale from "../../../../components/sales/new-sale"

const NewSalePage = async () => {
  const results = await Promise.allSettled([
    getProducts(),
    getCustomers(),
    branchesService.getBranches()
  ])

  const [products, customers, branches] = results.map((result) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    console.error('Error loading data:', result.reason)
    return []
  })

  return <NewSale products={products as any} customers={customers as any} branches={branches as any} />
}

export default NewSalePage;
