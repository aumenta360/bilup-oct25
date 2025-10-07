"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { PlusCircle, Trash2, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useState } from "react"
import { useToast } from "../../hooks/use-toast"
import type { Branch } from "../../types/branch"
import type { Customer } from "../../types/customer"
import type { Product } from "../../types/product"
import type React from "react"

interface NewSaleProps {
  products: Product[]
  customers: Customer[]
  branches: Branch[]
}

export default function NewSale({ products, customers, branches }: NewSaleProps) {
  const { toast } = useToast()
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [saleItems, setSaleItems] = useState<
    {
      productId: string
      quantity: number
      unitPrice: number
      subtotal: number
    }[]
  >([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [discount, setDiscount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const addProduct = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
      })
      return
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
      })
      return
    }

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const subtotal = product.precio * quantity

    setSaleItems([
      ...saleItems,
      {
        productId: product.id,
        quantity,
        unitPrice: product.precio,
        subtotal,
      },
    ])

    setSelectedProduct("")
    setQuantity(1)
  }

  const removeProduct = (index: number) => {
    const newItems = [...saleItems]
    newItems.splice(index, 1)
    setSaleItems(newItems)
  }

  const calculateTotal = () => {
    const subtotal = saleItems.reduce((acc, item) => acc + item.subtotal, 0)
    const discountAmount = subtotal * (discount / 100)
    return subtotal - discountAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (saleItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the sale",
      })
      return
    }

    setIsLoading(true)

    try {
      const newSale = {
        customerId: selectedCustomer || undefined,
        branchId: selectedBranch,
        items: saleItems,
        total: calculateTotal(),
        discount,
        paymentMethod,
        date: new Date().toISOString(),
      }

      // TODO: Implement sale creation
      console.log("New sale:", newSale)

      toast({
        title: "Sale registered",
        description: "The sale has been registered successfully",
      })

      // Clear form
      setSaleItems([])
      setSelectedCustomer("")
      setSelectedBranch("")
      setDiscount(0)
      setPaymentMethod("cash")
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not register the sale",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Sale</h2>
          <p className="text-muted-foreground">Register a new sale in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sale Information</CardTitle>
              <CardDescription>General sale information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">Anonymous customer</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
              <CardDescription>Select products for this sale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nombre} - ${product.precio.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <Button type="button" onClick={addProduct} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add product
              </Button>
            </CardContent>
          </Card>
        </div>

        {saleItems.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sale Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleItems.map((item, index) => {
                    const product = products.find((p) => p.id === item.productId)
                    return (
                      <TableRow key={index}>
                        <TableCell>{product?.nombre}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-lg font-medium">
                Total: ${calculateTotal().toFixed(2)}
              </div>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Save Sale"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  )
}
