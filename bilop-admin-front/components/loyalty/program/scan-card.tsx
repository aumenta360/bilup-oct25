"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { QrCode, Camera, Check, X, Award, CreditCard, Trophy } from "lucide-react"
import { useToast } from "../../../hooks/use-toast"
import type { Program } from "../../../types/program"
import type { Customer } from "../../../types/customer"

interface ScanCardProps {
  program: Program
  onSuccess?: (customer: Customer) => void
}

export function ScanCard({ program, onSuccess }: ScanCardProps) {
  const [mode, setMode] = useState<"manual" | "camera">("manual")
  const [code, setCode] = useState("")
  const [scanning, setScanning] = useState(false)
  const [customerFound, setCustomerFound] = useState<Customer | null>(null)
  const [actionPerformed, setActionPerformed] = useState(false)
  const { toast } = useToast()

  // Simulate QR scan
  const simulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      // Simulate finding a customer
      const simulatedCustomer: Customer = {
        id: "c" + Math.floor(Math.random() * 10000),
        name: "Example Customer",
        email: "customer@example.com",
        phone: "123456789",
        registrationDate: new Date().toISOString(),
        active: true,
        level: Math.random() > 0.5 ? "Gold" : "Silver",
        progress: Math.floor(Math.random() * 100),
        balance: Math.floor(Math.random() * 1000),
        programId: program.id
      }
      setCustomerFound(simulatedCustomer)
      setScanning(false)
    }, 2000)
  }

  // Search customer by code
  const searchCustomer = () => {
    if (!code.trim()) {
      toast({
        title: "Code required",
        description: "Please enter a valid card code",
      })
      return
    }

    setScanning(true)
    setTimeout(() => {
      // Simulate finding a customer
      if (Math.random() > 0.2) {
        // 80% chance of finding customer
        const simulatedCustomer: Customer = {
          id: code,
          name: "Customer " + code.substring(0, 4),
          email: `customer${code.substring(0, 4)}@example.com`,
          phone: "123456789",
          registrationDate: new Date().toISOString(),
          active: true,
          level: Math.random() > 0.5 ? "Gold" : "Silver",
          progress: Math.floor(Math.random() * 100),
          balance: Math.floor(Math.random() * 1000),
          programId: program.id
        }
        setCustomerFound(simulatedCustomer)
      } else {
        toast({
          title: "Customer not found",
          description: "No customer found with that code",
        })
      }
      setScanning(false)
    }, 1500)
  }

  // Perform action based on program type
  const performAction = () => {
    if (!customerFound) return

    let message = ""
    let title = ""

    switch (program.type) {
      case "points":
        title = "Stamp added"
        message = "A stamp has been added to the customer's card"
        break
      case "rewards":
        title = "Purchase registered"
        message = "The purchase has been registered and deducted from the customer's balance"
        break
      case "tier":
        title = "Points added"
        message = "Points have been added to the customer for their purchase"
        break
      default:
        title = "Action completed"
        message = "The action has been registered successfully"
    }

    toast({
      title,
      description: message,
    })

    setActionPerformed(true)

    if (onSuccess) {
      onSuccess(customerFound)
    }
  }

  // Reset the process
  const reset = () => {
    setCode("")
    setCustomerFound(null)
    setActionPerformed(false)
  }

  // Render action based on program type
  const renderAction = () => {
    switch (program.type) {
      case "points":
        return (
          <div className="text-center">
            <Award className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="text-lg font-medium mb-2">Add stamp</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The customer will receive a stamp on their loyalty card
            </p>
            <Button onClick={performAction} className="w-full">
              Add stamp
            </Button>
          </div>
        )
      case "rewards":
        return (
          <div className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="text-lg font-medium mb-2">Register purchase</h3>
            <div className="mb-4">
              <Label htmlFor="amount">Purchase amount</Label>
              <Input id="amount" type="number" placeholder="0.00" className="mt-1" />
            </div>
            <Button onClick={performAction} className="w-full">
              Process purchase
            </Button>
          </div>
        )
      case "tier":
        return (
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="text-lg font-medium mb-2">Add points</h3>
            <div className="mb-4">
              <Label htmlFor="points">Points to add</Label>
              <Input id="points" type="number" placeholder="0" className="mt-1" />
            </div>
            <Button onClick={performAction} className="w-full">
              Add points
            </Button>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <Button onClick={performAction} className="w-full">
              Complete action
            </Button>
          </div>
        )
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Scan Loyalty Card</CardTitle>
      </CardHeader>
      <CardContent>
        {!customerFound ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={mode === "manual" ? "default" : "ghost"}
                  className={`rounded-none ${mode === "manual" ? "" : "text-gray-500"}`}
                  onClick={() => setMode("manual")}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Manual code
                </Button>
                <Button
                  variant={mode === "camera" ? "default" : "ghost"}
                  className={`rounded-none ${mode === "camera" ? "" : "text-gray-500"}`}
                  onClick={() => setMode("camera")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Use camera
                </Button>
              </div>
            </div>

            {mode === "manual" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Card code</Label>
                  <Input
                    id="code"
                    placeholder="Enter the card code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={searchCustomer} className="w-full" disabled={scanning}>
                  {scanning ? "Searching..." : "Search customer"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Point the camera at the card's QR code</p>
                  <Button onClick={simulateScan} disabled={scanning}>
                    {scanning ? "Scanning..." : "Simulate scan"}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : actionPerformed ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Action completed!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The action has been successfully registered for {customerFound.name}
            </p>
            <Button onClick={reset} variant="outline" className="mr-2">
              Scan another card
            </Button>
            <Button onClick={() => setCustomerFound(null)}>View customer details</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{customerFound.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{customerFound.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={reset}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                <p className="text-xl font-bold">{customerFound.progress}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                <p className="text-xl font-bold">${customerFound.balance}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">{renderAction()}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {program.name} - {program.type} Program
        </p>
      </CardFooter>
    </Card>
  )
}
