import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  BarChart,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const DashboardPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-gray-500">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ventas totales</p>
                <h2 className="text-3xl font-bold">$12,628</h2>
                <div className="flex items-center mt-1 text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-xs">+12.5% este mes</span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clientes nuevos</p>
                <h2 className="text-3xl font-bold">54</h2>
                <div className="flex items-center mt-1 text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-xs">+8.2% este mes</span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transacciones</p>
                <h2 className="text-3xl font-bold">432</h2>
                <div className="flex items-center mt-1 text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-xs">+4.3% este mes</span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket promedio</p>
                <h2 className="text-3xl font-bold">$29.24</h2>
                <div className="flex items-center mt-1 text-red-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span className="text-xs">-2.1% este mes</span>
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="fidelizacion">Fidelización</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nuevos clientes por período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fidelizacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad de programas de fidelización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <BarChart className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage;