"use client"

import React, { useState, ForwardedRef } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Switch } from "../../../components/ui/switch"

interface BasicData {
  name: string
  active: boolean
  description: string
}

interface BasicDataFormProps {
  value: BasicData
  onChange: (data: BasicData) => void;
  nameRef: React.RefObject<HTMLInputElement>;
  nameError?: string | null;
}

const BasicDataForm = React.forwardRef<HTMLInputElement, BasicDataFormProps>(({ value, onChange, nameRef, nameError }, ref) => {
  const [touched, setTouched] = useState(false);
  const isNameInvalid = touched && !value.name.trim();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, name: e.target.value });
    setTouched(true);
  };

  return (
    <>
      <div className="mb-4">
        <p className="text-gray-500 dark:text-gray-400">
          Ingrese los datos básicos para crear o editar su programa de fidelización
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <p className="text-sm text-gray-500">
            Configure la información básica para su programa de fidelización
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="program-name">Nombre del Programa <span className="text-red-500">*</span></Label>
            <Input
              id="program-name"
              value={value.name}
              onChange={handleNameChange}
              onBlur={() => setTouched(true)}
              placeholder="Ingrese el nombre del programa"
              className={`w-full ${nameError ? 'border-red-500' : ''}`}
              maxLength={40}
              ref={nameRef}
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            <p className="text-xs text-gray-500">
              Este nombre será visible para sus clientes en su tarjeta
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="active-switch">Estado del Programa</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="active-switch"
                checked={value.active}
                onCheckedChange={checked => onChange({ ...value, active: checked })}
              />
              <span className="text-sm text-gray-500">
                {value.active ? "Activo: visible para los clientes" : "Inactivo: oculto para los clientes"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
});

export default BasicDataForm
