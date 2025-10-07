import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { loyaltyService } from "../../../services/loyalty-service";

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

const PAGE_SIZES = [10, 25, 50, 100];

function calcAge(birth: string) {
  if (!birth || birth.length < 8) return '';
  const parts = birth.split("/");
  if (parts.length !== 3) return '';
  const d = new Date(parts[2] + '-' + parts[1] + '-' + parts[0]);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

const initialCustomers: any[] = [];

interface CustomersFormProps {
  programId?: number;
  customers?: any[];
  onChange?: (customers: any[]) => void;
}

const CustomersForm: React.FC<CustomersFormProps> = ({ programId, customers: controlledCustomers, onChange }) => {
  const [localCustomers, setLocalCustomers] = useState<any[]>(initialCustomers);
  const customers = controlledCustomers !== undefined ? controlledCustomers : localCustomers;
  const setCustomers = onChange !== undefined ? onChange : setLocalCustomers;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);
  const [filterBirth, setFilterBirth] = useState(false);
  const [showEdit, setShowEdit] = useState<any | null>(null);
  const [showStamps, setShowStamps] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [programName, setProgramName] = useState("");

  useEffect(() => {
    if (!programId) return;
    loyaltyService.getProgramById(programId).then(data => setProgramName(data.name));
  }, [programId]);

  // Cargar clientes reales si hay programId
  useEffect(() => {
    if (!programId) return;
    setLoading(true);
    loyaltyService.getCustomers(programId)
      .then(data => setCustomers(data.map(c => ({
        ...c,
        birth: c.birthdate ? new Date(c.birthdate).toLocaleDateString('es-CL') : '',
      }))))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [programId]);

  // Filtros
  let filtered = customers;
  if (filterMonth) {
    filtered = filtered.filter(c => c.birth.split("/")[1] === (MONTHS.indexOf(filterMonth) + 1).toString().padStart(2, "0"));
  }
  if (filterBirth) {
    const now = new Date();
    filtered = filtered.filter(c => {
      const [d, m] = c.birth.split("/");
      const birthDate = new Date(now.getFullYear(), parseInt(m) - 1, parseInt(d));
      const diff = (birthDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    });
  }

  // Paginación
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Editar cliente
  const openEdit = (c: any) => {
    setEditForm({ ...c });
    setEditError("");
    setShowEdit(c.id);
  };
  const closeEdit = () => setShowEdit(null);
  const saveEdit = async () => {
    if (!editForm.firstName || !editForm.lastName || !editForm.phone || !editForm.email) {
      setEditError("Todos los campos son obligatorios");
      return;
    }
    // Validación de unicidad
    if (customers.some(c => c.id !== editForm.id && c.email === editForm.email)) {
      setEditError("Este correo ya está registrado");
      return;
    }
    if (customers.some(c => c.id !== editForm.id && c.phone === editForm.phone)) {
      setEditError("Este teléfono ya está registrado");
      return;
    }
    // Validación de largo de teléfono
    if (!editForm.phone || editForm.phone.length < 8) {
      setEditError("El teléfono debe tener al menos 8 caracteres");
      return;
    }
    if (programId) {
      setLoading(true);
      try {
        // Convertir birth a birthdate ISO si es válido
        const payload = { ...editForm };
        if (payload.birth) {
          const [d, m, y] = payload.birth.split('/');
          payload.birthdate = y && m && d ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : undefined;
        }
        delete (payload as any).stamps;
        delete (payload as any).birth;
        await loyaltyService.updateCustomer(programId, editForm.id, payload);
        const updated = await loyaltyService.getCustomers(programId);
        setCustomers(updated.map(c => ({
          ...c,
          birth: c.birthdate ? new Date(c.birthdate).toLocaleDateString('es-CL') : '',
        })));
        setShowEdit(null);
      } catch {
        setEditError("Error al actualizar cliente");
      } finally {
        setLoading(false);
      }
    } else {
      setCustomers(customers.map(c => c.id === editForm.id ? { ...editForm } : c));
      setShowEdit(null);
    }
  };

  // Ajustar estampillas
  const openStamps = (c: any) => setShowStamps({ id: c.id, value: c.stamps });
  const closeStamps = () => setShowStamps(null);
  const saveStamps = async () => {
    if (showStamps.value < 0) return;
    if (programId) {
      setLoading(true);
      try {
        await loyaltyService.updateCustomer(programId, showStamps.id, { stamps: showStamps.value });
        const updated = await loyaltyService.getCustomers(programId);
        setCustomers(updated);
        setShowStamps(null);
      } catch {
        setError("Error al actualizar estampillas");
      } finally {
        setLoading(false);
      }
    } else {
      setCustomers(customers.map(c => c.id === showStamps.id ? { ...c, stamps: showStamps.value } : c));
      setShowStamps(null);
    }
  };

  // Agregar cliente
  const handleAddCustomer = async () => {
    const newCustomer = {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birth: '',
      birthdate: undefined as string | undefined,
      stamps: 0,
      registered: new Date().toLocaleDateString(),
      lastVisit: '-',
    };
    if (programId) {
      // Validación de largo de teléfono
      if (!newCustomer.phone || newCustomer.phone.length < 8) {
        setError('El teléfono debe tener al menos 8 caracteres');
        return;
      }
      setLoading(true);
      try {
        // Convertir birth a birthdate ISO si es válido
        const payload = { ...newCustomer };
        if (payload.birth) {
          const [d, m, y] = payload.birth.split('/');
          payload.birthdate = y && m && d ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : undefined;
        }
        delete (payload as any).stamps;
        delete (payload as any).birth;
        await loyaltyService.createCustomer(programId, payload);
        const updated = await loyaltyService.getCustomers(programId);
        setCustomers(updated.map(c => ({
          ...c,
          birth: c.birthdate ? new Date(c.birthdate).toLocaleDateString('es-CL') : '',
        })));
      } catch {
        setError('Error al agregar cliente');
      } finally {
        setLoading(false);
      }
    } else {
      setCustomers([{ id: Date.now(), ...newCustomer }, ...customers]);
    }
  };

  // Eliminar cliente
  const handleDeleteCustomer = async (id: number) => {
    if (programId) {
      setLoading(true);
      try {
        await loyaltyService.deleteCustomer(programId, id);
        const updated = await loyaltyService.getCustomers(programId);
        setCustomers(updated);
      } catch {
        setError('Error al eliminar cliente');
      } finally {
        setLoading(false);
      }
    } else {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          className="border rounded px-2 py-1"
          value={filterMonth || ""}
          onChange={e => setFilterMonth(e.target.value || null)}
        >
          <option value="">Filtrar por Mes Nac.</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <Button variant="outline" onClick={() => setFilterBirth(b => !b)}>{filterBirth ? "Quitar filtro Cumpleaños" : "Filtrar Cumpleaños Próximos"}</Button>
        <Button variant="outline" onClick={handleAddCustomer}>Agregar Cliente</Button>
        <Button variant="outline">Exportar Vista</Button>
        <div className="ml-auto flex items-center gap-2">
          <span>Filas:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-2">
        <h2 className="text-lg font-semibold mb-2">Clientes del Programa {programName}</h2>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left font-semibold">Cliente</th>
                <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
                <th className="px-4 py-2 text-left font-semibold">Nacimiento</th>
                <th className="px-4 py-2 text-left font-semibold">Edad</th>
                <th className="px-4 py-2 text-left font-semibold">Estampillas</th>
                <th className="px-4 py-2 text-left font-semibold">Fecha Registro</th>
                <th className="px-4 py-2 text-left font-semibold">Última Visita</th>
                <th className="px-4 py-2 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-2 text-gray-400">No hay clientes</td></tr>
              )}
              {paginated.map(c => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2">
                    <span className="font-bold">{c.firstName} {c.lastName}</span>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2">{c.birth}</td>
                  <td className="px-4 py-2">{calcAge(c.birth)}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-bold relative group">
                      {c.stamps}
                      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:inline-flex gap-1">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5" onClick={() => setCustomers(customers.map(x => x.id === c.id ? { ...x, stamps: Math.max(0, x.stamps - 1) } : x))}>-1</Button>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5" onClick={() => setCustomers(customers.map(x => x.id === c.id ? { ...x, stamps: x.stamps + 1 } : x))}>+1</Button>
                        <Button size="sm" variant="outline" onClick={() => openStamps(c)}>Editar</Button>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2">{c.registered}</td>
                  <td className="px-4 py-2">{c.lastVisit}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      <span role="img" aria-label="Editar">✏️</span>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomer(c.id)}>
                      <span role="img" aria-label="Eliminar">🗑️</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Mostrando {paginated.length} de {total} clientes filtrados (total {customers.length})</span>
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</Button>
            <span>Página {page} de {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Siguiente</Button>
          </div>
        </div>
      </div>
      {/* Modal Editar Cliente */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Cliente</h3>
            <div className="space-y-4">
              <Input value={editForm.firstName} onChange={e => setEditForm((f: any) => ({ ...f, firstName: e.target.value }))} placeholder="Nombre" />
              <Input value={editForm.lastName} onChange={e => setEditForm((f: any) => ({ ...f, lastName: e.target.value }))} placeholder="Apellido" />
              <Input value={editForm.phone} onChange={e => setEditForm((f: any) => ({ ...f, phone: e.target.value }))} placeholder="Teléfono" />
              <Input value={editForm.email} onChange={e => setEditForm((f: any) => ({ ...f, email: e.target.value }))} placeholder="Correo" type="email" />
              <Input value={editForm.birth} onChange={e => setEditForm((f: any) => ({ ...f, birth: e.target.value }))} placeholder="F. Nacimiento (dd/mm/aaaa)" />
              {editError && <p className="text-red-500 text-xs mt-1">{editError}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeEdit}>Cancelar</Button>
              <Button onClick={saveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Ajustar Estampillas */}
      {showStamps && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajustar Estampillas</h3>
            <div className="space-y-4">
              <Input type="number" value={showStamps.value} min={0} onChange={e => setShowStamps((s: any) => ({ ...s, value: Math.max(0, Number(e.target.value)) }))} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeStamps}>Cancelar</Button>
              <Button onClick={saveStamps} className="bg-blue-500 hover:bg-blue-600 text-white">Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersForm;
