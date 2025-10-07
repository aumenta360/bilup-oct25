'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Tipo para las propiedades del componente de error
interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en algún servicio
    console.error('Error en la aplicación:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-4">¡Algo salió mal!</h1>
        <p className="text-gray-600 mb-8">
          Se produjo un error inesperado. Por favor, intenta de nuevo.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 