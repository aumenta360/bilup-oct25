import Analytics from "../../../../components/loyalty/analytics/analytics-dashboard"
import { getAnalytics } from "../../../../services/analytics-service"

const AnalyticsPage = async () => {
  const data = await getAnalytics()

  return <Analytics program={data.programs[0]} analyticsData={data} />
}

export default AnalyticsPage
