"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import Link from "next/link"
import type { Program } from "../../types/program"
import { createCustomer } from "../../services/customers-service"

interface NewCustomerProps {
  programs: Program[]
}

export function NewCustomer({ programs }: NewCustomerProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [active, setActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate form
  const isFormValid = name.trim() !== "" && email.trim() !== ""

  // Save customer
  const saveCustomer = async () => {
    if (!isFormValid) {
      toast({
        title: "Error",
        description: "Please complete the required fields",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare customer data
      const customerData = {
        name,
        email,
        phone: phone || undefined,
        birthDate: birthDate || undefined,
        gender: gender || undefined,
        address: address || undefined,
        city: city || undefined,
        programId: selectedProgram || undefined,
        active,
      }

      // Create customer
      const newCustomer = await createCustomer(customerData)

      toast({
        title: "Customer registered",
        description: `Customer ${name} has been successfully registered`,
      })

      // Redirect to customer details page
      router.push(`/customers/${newCustomer.id}`)
    } catch (error) {
      console.error("Error registering customer:", error)
      toast({
        title: "Error",
        description: "An error occurred while registering the customer. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/customers">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Customer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth-date">Birth date</Label>
                <Input
                  id="birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="unspecified">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="program">Loyalty Program</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger id="program" className="mt-1">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="active-switch">Customer status</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">{active ? "Active" : "Inactive"}</p>
              </div>
              <Switch id="active-switch" checked={active} onCheckedChange={setActive} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={saveCustomer}
          disabled={isSubmitting || !isFormValid}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save customer
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
