import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { loyaltyService } from "../../../services/loyalty-service";

const BASE_URL = "https://bilup.com/r/";
const MAX_LINKS = 50;

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

function generateQR(url: string) {
  // Mock: retorna un string base64 (en real usarías una lib de QR)
  return `data:image/svg+xml;base64,${btoa(`<svg width='100' height='100'><rect width='100' height='100' fill='#eee'/><text x='10' y='50' font-size='12'>QR</text></svg>`)}`;
}

const KPI_LABELS = [
  { key: "totalCustomers", label: "Total de Clientes" },
  { key: "totalVisits", label: "Total de Visitas" },
  { key: "totalRegistrations", label: "Total de Registros" },
  { key: "totalActions", label: "Total de Acciones" },
];

const EXAMPLES = [
  "Instagram Bio", "Facebook Post", "Whatsapp Status",
  "QR en Mesa", "QR en Caja", "Volante", "Email", "SMS", "Sitio Web"
];

const initialLinks = [
  // Ejemplo de enlace inicial
   { id: 1, name: "QR en mesa", url: BASE_URL + "abc123", qr: generateQR(BASE_URL + "abc123"), visits: 1, registrations: 1, actions: 0, active: true, createdAt: new Date() }
];

interface ShareFormProps {
  programId?: number;
  links?: any[];
  onChange?: (links: any[]) => void;
}

const ShareForm: React.FC<ShareFormProps> = ({ programId, links: controlledLinks, onChange }) => {
  const [localLinks, setLocalLinks] = useState<any[]>(initialLinks);
  const links = Array.isArray(controlledLinks) ? controlledLinks : localLinks;
  const setLinks = onChange !== undefined ? onChange : setLocalLinks;
  const [kpi, setKpi] = useState({
    totalCustomers: 1,
    totalVisits: 8,
    totalRegistrations: 1,
    totalActions: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalError, setModalError] = useState("");
  const [showQR, setShowQR] = useState<{ open: boolean; qr: string; url: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Cargar links reales si hay programId
  useEffect(() => {
    if (!programId) return;
    (async () => {
      try {
        const data = await loyaltyService.getShareLinks(programId);
        setLinks(data);
      } catch (e) {
        setLinks([]);
      }
    })();
  }, [programId]);

  // KPI recalculado en base a los links
  React.useEffect(() => {
    setKpi({
      totalCustomers: links.length,
      totalVisits: links.reduce((a, l) => a + (l.visits || 0), 0),
      totalRegistrations: links.reduce((a, l) => a + (l.registrations || 0), 0),
      totalActions: links.reduce((a, l) => a + (l.actions || 0), 0),
    });
  }, [links]);

  const handleCreateLink = () => {
    setModalName("");
    setModalError("");
    setShowModal(true);
  };
  const handleModalClose = () => setShowModal(false);

  const handleModalSave = async () => {
    if (!modalName.trim()) {
      setModalError("El nombre es obligatorio");
      return;
    }
    if (modalName.length > 40) {
      setModalError("Máximo 40 caracteres");
      return;
    }
    if (links.some(l => l.name.toLowerCase() === modalName.trim().toLowerCase())) {
      setModalError("Ya existe un enlace con ese nombre");
      return;
    }
    if (links.length >= MAX_LINKS) {
      setModalError("Has alcanzado el máximo de 50 enlaces para este programa");
      return;
    }
    if (programId) {
      // Backend
      try {
        const created = await loyaltyService.createShareLink(programId, { name: modalName.trim() });
        setLinks([created, ...links]);
        setShowModal(false);
      } catch (e) {
        setModalError("Error al crear el enlace");
      }
    } else {
      // Mock local
    const code = generateCode();
    const url = BASE_URL + code;
    const qr = generateQR(url);
    setLinks([{ id: Date.now(), name: modalName.trim(), url, qr, visits: 0, registrations: 0, actions: 0, active: true, createdAt: new Date() }, ...links]);
    setShowModal(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setToast("Copiado");
    setTimeout(() => setToast(null), 1500);
  };

  const handleShowQR = (qr: string, url: string) => setShowQR({ open: true, qr, url });
  const handleCloseQR = () => setShowQR(null);

  const handleToggleActive = async (id: number) => {
    if (programId) {
      const link = links.find(l => l.id === id);
      if (!link) return;
      try {
        const updated = await loyaltyService.updateShareLink(programId, id, { active: !link.active });
        setLinks(links.map(l => l.id === id ? updated : l));
      } catch (e) {
        setToast("Error al actualizar el estado");
      }
    } else {
    setLinks(links.map(l => l.id === id ? { ...l, active: !l.active } : l));
    }
  };

  const handleDelete = (id: any) => {
    if (onChange) {
      onChange(links.filter(link => link.id !== id));
    } else {
      setLocalLinks(links.filter(link => link.id !== id));
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_LABELS.map(k => (
          <div key={k.key} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{k.label}</span>
            <span className="text-2xl font-bold text-blue-600">{kpi[k.key as keyof typeof kpi]}</span>
          </div>
        ))}
      </div>

      {/* Tabla de enlaces */}
      <div className=" rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Enlaces de Registro</h2>
          <Button onClick={handleCreateLink} className="bg-blue-500 hover:bg-blue-600 text-white">Crear Nuevo Enlace</Button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left font-semibold">Fuente</th>
                <th className="px-4 py-2 text-left font-semibold">Enlace (URL)</th>
                <th className="px-4 py-2 text-left font-semibold">Visitas</th>
                <th className="px-4 py-2 text-left font-semibold">Registros</th>
                <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                <th className="px-4 py-2 text-left font-semibold">Estado</th>
                <th className="px-4 py-2 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-gray-400">No hay enlaces creados</td></tr>
              )}
              {links.map(l => (
                <tr key={l.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{l.name}</td>
                  <td className="px-4 py-2">
                    <span className="text-blue-600 underline cursor-pointer" onClick={() => handleCopy(l.url)}>{l.url}</span>
                  </td>
                  <td className="px-4 py-2">{l.visits}</td>
                  <td className="px-4 py-2">{l.registrations}</td>
                  <td className="px-4 py-2">{l.actions}</td>
                  <td className="px-4 py-2">
                    <Switch checked={l.active} onCheckedChange={() => handleToggleActive(l.id)} />
                    <span className={l.active ? " text-green-600" : "ml text-gray-400"}>{l.active ? "Activo" : "Inactivo"}</span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopy(l.url)}>Copiar URL</Button>
                    <Button size="sm" variant="outline" onClick={() => handleShowQR(l.qr, l.url)}>Ver QR</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(l.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Enlace */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Enlace de Registro</h3>
            <div className="space-y-4">
              <Input
                value={modalName}
                onChange={e => setModalName(e.target.value)}
                maxLength={40}
                placeholder="Nombre del enlace (ej: Instagram Bio, QR Mesa)"
              />
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {EXAMPLES.map(ex => (
                  <span key={ex} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded cursor-pointer" onClick={() => setModalName(ex)}>{ex}</span>
                ))}
              </div>
              {modalError && <p className="text-red-500 text-xs mt-1">{modalError}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleModalClose}>Cancelar</Button>
              <Button onClick={handleModalSave} className="bg-blue-500 hover:bg-blue-600 text-white">Crear Enlace</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {showQR && showQR.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">QR del Enlace</h3>
            <img src={showQR.qr} alt="QR" className="mb-4 w-40 h-40" />
            <p className="text-xs break-all mb-4">{showQR.url}</p>
            <Button onClick={handleCloseQR}>Cerrar</Button>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">¿Eliminar enlace?</h3>
            <p className="mb-4 text-sm text-gray-600">Esta acción no afecta a clientes que ya lo tengan, pero no se podrá acceder desde nuevas visitas.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => { if (deleteId !== null) handleDelete(deleteId); }}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Copiado */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ShareForm;
