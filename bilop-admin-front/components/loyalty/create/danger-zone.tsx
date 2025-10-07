import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { loyaltyService } from "@/services/loyalty-service";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DangerZoneProps {
  programId: number;
  currentExpiration?: {
    enabled: boolean;
    type: 'days' | 'weeks' | 'months' | 'years';
    value: number;
  };
  onDeleted?: () => void;
  onExpirationUpdated?: (exp: any) => void;
}

const EXP_UNITS = [
  { value: 'days', label: 'Días', min: 1, max: 365 },
  { value: 'weeks', label: 'Semanas', min: 1, max: 52 },
  { value: 'months', label: 'Meses', min: 1, max: 24 },
  { value: 'years', label: 'Años', min: 1, max: 5 },
];

export const DangerZone: React.FC<DangerZoneProps> = ({ programId, currentExpiration, onDeleted, onExpirationUpdated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [deleteInput, setDeleteInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Expiración
  const [expEnabled, setExpEnabled] = useState(currentExpiration?.enabled ?? false);
  const [expValue, setExpValue] = useState(currentExpiration?.value ?? 1);
  const [expType, setExpType] = useState(currentExpiration?.type ?? 'months');
  const [expError, setExpError] = useState<string | null>(null);
  const [savingExp, setSavingExp] = useState(false);

  if (!user || user.role !== "admin") return null;

  // --- SOFT DELETE ---
  const handleDelete = async () => {
    setLoading(true);
    try {
      await loyaltyService.deleteProgram(programId);
      toast({ title: "Programa eliminado", description: "El programa fue eliminado correctamente" });
      setShowConfirm(false);
      if (onDeleted) onDeleted();
      router.push('/loyalty');
    } catch (e) {
      toast({ title: "Error", description: "No se pudo eliminar el programa" });
    } finally {
      setLoading(false);
    }
  };

  // --- EXPIRACIÓN ---
  const handleSaveExpiration = async () => {
    setExpError(null);
    const unit = EXP_UNITS.find(u => u.value === expType);
    if (expEnabled && (expValue < unit!.min || expValue > unit!.max)) {
      setExpError(`Valor fuera de rango permitido (${unit!.min}-${unit!.max})`);
      return;
    }
    setSavingExp(true);
    try {
      await loyaltyService.updateProgram(programId, {
        expirationConfig: expEnabled ? { enabled: true, type: expType, value: expValue } : { enabled: false, type: expType, value: expValue },
      });
      toast({ title: "Configuración guardada", description: expEnabled ? "La expiración fue actualizada" : "La expiración fue deshabilitada" });
      if (onExpirationUpdated) onExpirationUpdated({ enabled: expEnabled, type: expType, value: expValue });
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar la configuración" });
    } finally {
      setSavingExp(false);
    }
  };

  // --- UI ---
  return (
    <div className="space-y-8 mt-8">
      {/* Bloque Eliminar */}
      <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-red-500" />
          <span className="font-bold text-red-600 text-lg">Zona de Peligro</span>
        </div>
        <p className="text-sm text-red-700 mb-4">Esta acción es <b>irreversible</b>. El programa y sus datos quedarán ocultos para los clientes.</p>
        <div className="flex flex-col sm:flex-row gap-2 items-center mb-2">
          <Input
            placeholder="Escribe ELIMINAR para habilitar"
            value={deleteInput}
            onChange={e => setDeleteInput(e.target.value)}
            className="max-w-xs border-red-300"
            autoComplete="off"
          />
          <Button
            variant="destructive"
            disabled={deleteInput.trim().toLowerCase() !== "eliminar" || loading}
            onClick={() => setShowConfirm(true)}
            className="w-full sm:w-auto"
          >
            Eliminar club de fidelidad
          </Button>
        </div>
        <p className="text-xs text-gray-500">Debes escribir <b>ELIMINAR</b> para habilitar el botón.</p>
      </div>

      {/* Modal de confirmación */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción ocultará permanentemente tu programa y sus datos. ¿Continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button disabled={loading} onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              {loading ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bloque Expiración */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-blue-600 text-lg">Fecha de vencimiento (opcional)</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-medium">Expiración</span>
          <Switch checked={expEnabled} onCheckedChange={setExpEnabled} />
          <span className="ml-2">{expEnabled ? "Habilitado" : "Deshabilitado"}</span>
        </div>
        {expEnabled && (
          <div className="flex flex-col sm:flex-row gap-4 mb-2 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <Input
                type="number"
                min={EXP_UNITS.find(u => u.value === expType)?.min}
                max={EXP_UNITS.find(u => u.value === expType)?.max}
                value={expValue}
                onChange={e => setExpValue(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unidad de tiempo</label>
              <Select value={expType} onValueChange={v => setExpType(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXP_UNITS.map(u => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mt-2">Las tarjetas expirarán después de <b>{expValue}</b> {EXP_UNITS.find(u => u.value === expType)?.label.toLowerCase()}.</p>
            </div>
          </div>
        )}
        {expError && <p className="text-xs text-red-500 mb-2">{expError}</p>}
        <Button onClick={handleSaveExpiration} disabled={savingExp} className="mt-2">
          {savingExp ? "Guardando..." : "Guardar configuración de expiración"}
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
