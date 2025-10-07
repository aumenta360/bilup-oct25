import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { loyaltyService } from "../../../services/loyalty-service";
import { useToast } from "../../../hooks/use-toast";

const MAX_MESSAGES = 20;
const ORIGINS = ["Todos", "Instagram Bio", "QR en Mesa", "Facebook Post", "Volante"];

interface PushMessageProps {
  programId?: number
  value?: any[]
  onChange?: (messages: any[]) => void
}

const PushMessage: React.FC<PushMessageProps> = ({ programId, value, onChange }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>(value || []);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'new' | 'edit'>('new');
  const [modalMsg, setModalMsg] = useState<any>({});
  const [modalError, setModalError] = useState("");
  const [showHistory, setShowHistory] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setMessages(value);
    }
  }, [value]);

  const openNew = () => {
    setModalType('new');
    setModalMsg({
      title: "",
      message: "",
      origins: ["Todos"],
      stamps: 0,
      scheduled: false,
      date: "",
    });
    setModalError("");
    setShowModal(true);
  };

  const openEdit = (msg: any) => {
    setModalType('edit');
    const scheduledDate = msg.scheduledAt ? new Date(msg.scheduledAt).toISOString().slice(0, 16) : "";
    setModalMsg({
      ...msg,
      scheduled: msg.status === 'scheduled',
      date: scheduledDate,
    });
    setModalError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const saveMsg = async () => {
    if (!modalMsg.title.trim()) {
      setModalError("El título es obligatorio");
      return;
    }
    if (modalMsg.title.length > 40) {
      setModalError("Máx. 40 caracteres en título");
      return;
    }
    if (!modalMsg.message.trim()) {
      setModalError("El mensaje es obligatorio");
      return;
    }
    if (modalMsg.message.length > 120) {
      setModalError("Máx. 120 caracteres en mensaje");
      return;
    }
    if (messages.length >= MAX_MESSAGES && modalType === 'new') {
      setModalError("Límite de 20 mensajes alcanzado");
      return;
    }
    if (modalMsg.scheduled && (!modalMsg.date || !isDateInRange(modalMsg.date))) {
      setModalError("Sólo se puede programar hasta 30 días");
      return;
    }

    const messageToSave = {
      ...modalMsg,
      origins: typeof modalMsg.origins === 'string' ? [modalMsg.origins] : modalMsg.origins,
      exactStamps: Number(modalMsg.stamps) || 0,
      status: modalMsg.scheduled && modalMsg.date ? "Programado" : "Borrador",
      scheduledAt: modalMsg.scheduled && modalMsg.date ? new Date(modalMsg.date).toISOString() : null,
      stamps: undefined,
      scheduled: undefined,
      date: undefined,
      history: undefined,
    };

    let newMessages;
    if (modalType === 'new' || !messageToSave.id) {
      newMessages = [{ ...messageToSave, id: Date.now() }, ...messages];
    } else {
      newMessages = messages.map(m => m.id === messageToSave.id ? { ...messageToSave } : m);
    }

    setMessages(newMessages);
    if (onChange) onChange(newMessages);
    setShowModal(false);
    toast({ title: "Éxito", description: `Mensaje ${modalType === 'new' ? 'creado' : 'actualizado'} localmente. Clic en 'Guardar Cambios' para persistir.` });
  };

  const sendMsg = async (id: number) => {
    try {
      if (programId) {
        toast({ title: "Éxito", description: "Mensaje enviado (simulado)" });
        const updatedMessages = messages.map(m => m.id === id ? { ...m, state: "Enviado", date: new Date().toLocaleString() } : m);
        setMessages(updatedMessages);
        if (onChange) onChange(updatedMessages);
      } else {
        setMessages(messages.map(m => m.id === id ? { ...m, state: "Enviado", date: new Date().toLocaleString() } : m));
        setToastMsg("Mensaje enviado");
        setTimeout(() => setToastMsg(null), 1500);
      }
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar el mensaje" });
    }
  };

  const deleteMsg = async (id: number) => {
    const newMessages = messages.filter(m => m.id !== id);
    setMessages(newMessages);
    if (onChange) onChange(newMessages);
    toast({ title: "Éxito", description: "Mensaje eliminado localmente. Clic en 'Guardar Cambios' para persistir." });
  };

  const duplicateMsg = async (msg: any) => {
    if (messages.length >= MAX_MESSAGES) {
      toast({ title: "Error", description: "Límite de 20 mensajes alcanzado" });
      return;
    }

    const duplicatedMessage = {
      ...msg,
      id: Date.now(),
      status: "Borrador",
      scheduledAt: null,
      date: "",
      history: [],
    };

    const newMessages = [duplicatedMessage, ...messages];
    setMessages(newMessages);
    if (onChange) onChange(newMessages);
    toast({ title: "Éxito", description: "Mensaje duplicado localmente. Clic en 'Guardar Cambios' para persistir." });
  };

  const openHistory = (msg: any) => setShowHistory(msg);
  const closeHistory = () => setShowHistory(null);

  function isDateInRange(dateStr: string) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }

  if (loading) return <div className="p-4 text-center">Cargando mensajes...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mensajes Push</h2>
        <Button onClick={openNew} className="bg-blue-500 hover:bg-blue-600 text-white">Nuevo Mensaje</Button>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-2">
        <table className="w-full text-xs rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left font-semibold">Título</th>
              <th className="px-4 py-2 text-left font-semibold">Mensaje</th>
              <th className="px-4 py-2 text-left font-semibold">Fecha</th>
              <th className="px-4 py-2 text-left font-semibold">Estado</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(messages) || messages.length === 0) && (
              <tr><td colSpan={5} className="text-center py-2 text-gray-400">No hay mensajes</td></tr>
            )}
            {Array.isArray(messages) && messages.map(m => (
              <tr key={m.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-2 font-bold">{m.title}</td>
                <td className="px-4 py-2">{m.message.slice(0, 50)}{m.message.length > 50 ? '…' : ''}</td>
                <td className="px-4 py-2">{m.status === "Programado" && m.scheduledAt ? new Date(m.scheduledAt).toLocaleString() : m.status === "Enviado" && m.sentAt ? new Date(m.sentAt).toLocaleString() : "-"}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${m.status === "Borrador" ? "bg-blue-100 text-blue-700" : m.status === "Enviado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{m.status}</span>
                </td>
                <td className="px-4 py-2 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)} disabled={m.status !== "Borrador"}>Editar</Button>
                  {(m.status === "Borrador" || m.status === "Programado") && <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => sendMsg(m.id)}>Enviar</Button>}
                  <Button size="sm" variant="outline" onClick={() => openHistory(m)}>Ver envíos</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMsg(m.id)}>Eliminar</Button>
                  {m.status === "Enviado" && <Button size="sm" variant="outline" onClick={() => duplicateMsg(m)}>Duplicar</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{modalType === 'new' ? 'Nuevo Mensaje' : 'Editar Mensaje'}</h3>
            <div className="space-y-4">
              <Input value={modalMsg.title || ''} maxLength={40} onChange={e => setModalMsg((f: any) => ({ ...f, title: e.target.value }))} placeholder="Título interno (máx 40)" />
              <Input value={modalMsg.message || ''} maxLength={120} onChange={e => setModalMsg((f: any) => ({ ...f, message: e.target.value }))} placeholder="Mensaje al cliente (máx 120)" />
              <div>
                <label className="block text-xs font-medium mb-1">Origen</label>
                <select multiple value={Array.isArray(modalMsg.origins) ? modalMsg.origins : ["Todos"]} onChange={e => setModalMsg((f: any) => ({ ...f, origins: Array.from(e.target.selectedOptions, o => o.value) }))} className="w-full border rounded px-2 py-1">
                  {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Cantidad exacta de sellos</label>
                <Input type="number" min={0} value={modalMsg.stamps || 0} onChange={e => setModalMsg((f: any) => ({ ...f, stamps: Math.max(0, Number(e.target.value)) }))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={modalMsg.scheduled} onCheckedChange={v => setModalMsg((f: any) => ({ ...f, scheduled: v }))} />
                <span>Programar envío</span>
              </div>
              {modalMsg.scheduled && (
                <Input type="datetime-local" value={modalMsg.date || ''} onChange={e => setModalMsg((f: any) => ({ ...f, date: e.target.value }))} />
              )}
              {modalError && <p className="text-red-500 text-xs mt-1">{modalError}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={saveMsg} className="bg-blue-500 hover:bg-blue-600 text-white">Guardar</Button>
            </div>
          </div>
        </div>
      )}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Historial de Envíos</h3>
            <table className="w-full text-xs border mb-4">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-2 py-1 text-left">Cliente</th>
                  <th className="px-2 py-1 text-left">Fecha/Hora</th>
                  <th className="px-2 py-1 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {showHistory.history && showHistory.history.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-2 text-gray-400">Sin envíos</td></tr>
                )}
                {showHistory.history && Array.isArray(showHistory.history) && showHistory.history.map((h: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{h.client}</td>
                    <td className="px-2 py-1">{h.date}</td>
                    <td className="px-2 py-1">{h.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeHistory}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default PushMessage;
