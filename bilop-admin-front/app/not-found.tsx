import Link from 'next/link';

// Marcar como página de renderización estática
export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
} 