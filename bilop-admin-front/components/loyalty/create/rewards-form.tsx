import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { loyaltyService } from "../../../services/loyalty-service";

interface Reward {
  // Define los campos relevantes de una recompensa aquí
  [key: string]: any
}

interface RewardsFormProps {
  programId?: number;
  value: Reward[];
  onChange: (rewards: Reward[]) => void;
}

const RewardsForm: React.FC<RewardsFormProps> = ({ programId, value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Reward, "id">>({
    title: "",
    requiredStamps: 1,
    redeemDays: 30,
    pushOnAchieve: true,
    active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    setForm({ title: "", requiredStamps: 1, redeemDays: 30, pushOnAchieve: true, active: true });
    setError("");
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSwitch = (name: string, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validaciones
    if (!form.title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (value.some(r => r.title.toLowerCase() === form.title.trim().toLowerCase())) {
      setError("Ya existe una recompensa con ese título");
      return;
    }
    if (form.requiredStamps < 1) {
      setError("Debes indicar un número válido de estampillas");
      return;
    }
    if (form.redeemDays < 0 || form.redeemDays > 365) {
      setError("El plazo máximo permitido es 365 días");
      return;
    }
    onChange([{ id: `temp-${Date.now()}`, ...form }, ...value]);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    onChange(value.filter(r => r.id !== id));
  };

  const handleToggleActive = (id: number) => {
    onChange(value.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <Card className="border rounded-xl p-8 max-w-4xl mx-auto mt-6 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recompensas del Club de Fidelidad</h2>
          <Button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-600 text-white">Crear Recompensa</Button>
        </div>
        {loading && <div className="text-center text-xs text-gray-500">Cargando recompensas...</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">Título</th>
                <th className="px-4 py-2 text-left">Estampillas necesarias</th>
                <th className="px-4 py-2 text-left">Plazo (días)</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {value.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-gray-400">No hay recompensas creadas</td></tr>
              )}
              {value.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.requiredStamps}</td>
                  <td className="px-4 py-2">{r.expirationDays ?? (r.redeemDays === 0 ? "—" : r.redeemDays)}</td>
                  <td className="px-4 py-2">
                    <Switch checked={r.active} onCheckedChange={() => handleToggleActive(r.id)} />
                    <span className={r.active ? "ml-2 text-green-600" : "ml-2 text-gray-400"}>{r.active ? "Activo" : "Inactivo"}</span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Nueva Recompensa</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título de la recompensa</label>
                  <Input name="title" maxLength={40} value={form.title} onChange={handleChange} placeholder="Café gratis" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nº de estampillas necesarias</label>
                  <Input name="requiredStamps" type="number" min={1} value={form.requiredStamps} onChange={handleChange} placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Plazo para redimir (días, 0 = sin vencimiento)</label>
                  <Input name="redeemDays" type="number" min={0} max={365} value={form.redeemDays} onChange={handleChange} placeholder="30" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.pushOnAchieve} onCheckedChange={v => handleSwitch('pushOnAchieve', v)} />
                  <span>Push al alcanzar</span>
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">Crear recompensa</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsForm;
