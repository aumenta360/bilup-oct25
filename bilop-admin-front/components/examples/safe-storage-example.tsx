'use client';

import { useState, useEffect } from 'react';
import { safeLocalStorage } from "../../lib/localStorage";
import ClientOnly from "../../components/client-only";

export default function SafeStorageExample() {
  const [value, setValue] = useState('');
  const [storedValue, setStoredValue] = useState<string | null>(null);

  // Cargar valor al inicio
  useEffect(() => {
    const value = safeLocalStorage.getItem('example-key');
    setStoredValue(value);
  }, []);

  // Guardar valor en localStorage
  const handleSave = () => {
    safeLocalStorage.setItem('example-key', value);
    setStoredValue(value);
  };

  // Eliminar valor de localStorage
  const handleClear = () => {
    safeLocalStorage.removeItem('example-key');
    setStoredValue(null);
    setValue('');
  };

  return (
    <ClientOnly>
      <div className="p-4 border rounded-md">
        <h2 className="text-xl font-bold mb-4">Ejemplo de uso seguro de localStorage</h2>
        
        <div className="mb-4">
          <p className="mb-2">Valor actual en localStorage: {storedValue || 'No hay valor guardado'}</p>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 flex-grow"
            placeholder="Escribe algo para guardar"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
          <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded">
            Borrar
          </button>
        </div>
      </div>
    </ClientOnly>
  );
} 