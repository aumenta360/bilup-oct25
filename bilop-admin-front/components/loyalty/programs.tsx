"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { useRouter } from "next/navigation"
import { loyaltyService } from "../../services/loyalty-service"
import type { Program, ProgramStatus } from "../../types/loyalty"

const ProgramsPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<ProgramStatus | 'all'>('all');

  const getStatusBadge = (status: ProgramStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
            <span className="material-icons text-base mr-1">check_circle</span>
            Activa
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
            <span className="material-icons text-base mr-1">pause_circle</span>
            Pausada
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
            <span className="material-icons text-base mr-1">drafts</span>
            Borrador
          </span>
        );
    }
  };

  // Function to determine program status if not explicitly provided or incorrectly provided by backend
  const determineProgramStatus = (program: Program): ProgramStatus => {
    // If the program is marked as active, it should be considered 'active'
    if (program.active) {
      return "active";
    }

    // If not active, but has customers or points, assume it's paused
    if (program.totalCustomers > 0 || program.totalPoints > 0) {
      return "paused";
    }

    // Otherwise, if it has no activity and is not active, it's a draft
    return "draft";
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await loyaltyService.getPrograms()
        console.log('Programas fetched:', data);
        setPrograms(data)
      } catch (error: any) {
        console.error('Error completo:', error)
        toast({
          title: "Error al cargar programas",
          description: error.message || "No se pudieron cargar los programas. Por favor, intente nuevamente."
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrograms()
  }, [toast])

  // Effect to handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) { // Only if a menu is currently open
        const currentMenuRef = menuRefs.current[openMenuId];
        if (currentMenuRef && !currentMenuRef.contains(event.target as Node)) {
          setOpenMenuId(null); // Close the menu
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]); // Re-run effect when openMenuId changes

  const handleCreateProgram = () => {
    router.push("/loyalty/create")
  }

  const handleDeleteProgram = async (id: number) => {
    try {
      await loyaltyService.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Programa eliminado",
        description: "El programa fue eliminado correctamente."
      });
    } catch (error: any) {
      console.error('Error eliminando programa:', error);
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el programa."
      });
    }
  };

  const handleToggleProgramStatus = async (id: number, currentStatus: boolean) => {
    try {
      const newActiveStatus = !currentStatus;
      await loyaltyService.updateProgramStatus(id, newActiveStatus);
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, active: newActiveStatus, status: determineProgramStatus({ ...p, active: newActiveStatus }) } : p
        )
      );
      toast({
        title: "Estado del programa actualizado",
        description: `El programa fue ${newActiveStatus ? 'activado' : 'pausado'} correctamente.`
      });
    } catch (error: any) {
      console.error('Error actualizando estado del programa:', error);
      toast({
        title: "Error al actualizar estado",
        description: error.message || "No se pudo actualizar el estado del programa. Por favor, intente nuevamente."
      });
    }
  };

  // Filter programs based on searchTerm and filterStatus
  const filteredPrograms = programs.filter(program => {
    const matchesSearchTerm = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    const programStatus = determineProgramStatus(program);
    const matchesStatus = filterStatus === 'all' || programStatus === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Club de Beneficios</h1>
          <p className="text-gray-500 dark:text-gray-400">Administre sus programas de lealtad activas</p>
        </div>
        <Button onClick={handleCreateProgram} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Crear Programa
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre de programa..."
          className="w-full md:w-2/3 p-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="relative w-full md:w-1/3">
          <select
            className="appearance-none w-full p-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProgramStatus | 'all')}
          >
            <option value="all">Filtrar por estado</option>
            <option value="active">Activo</option>
            <option value="paused">Pausado</option>
            <option value="draft">Borrador</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredPrograms.length === 0 && (searchTerm === '' && filterStatus === 'all') ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm mx-auto p-6 flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay programas creados</h3>
            <p className="text-gray-500 text-center mb-4">
              Comience creando su primer programa de fidelización
            </p>
            <Button onClick={handleCreateProgram} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Programa
            </Button>
          </div>
      ) : filteredPrograms.length === 0 && (searchTerm !== '' || filterStatus !== 'all') ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm mx-auto p-6 flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium mb-2">No se encontraron programas</h3>
          <p className="text-gray-500 text-center mb-4">
            Intente ajustar sus filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const programStatus = determineProgramStatus(program);

            return (
              <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{program.name}</h2>
                      {getStatusBadge(programStatus)}
                    </div>
                    <div className="relative" ref={(el: HTMLDivElement | null) => { menuRefs.current[program.id] = el; }}>
                      <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setOpenMenuId(openMenuId === program.id ? null : program.id)}
                      >
                        <span className="material-icons">more_vert</span>
                      </button>
                      <div className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10 ${openMenuId === program.id ? 'block' : 'hidden'}`}>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => router.push(`/loyalty/program/${program.id}/edit`)}>
                          <span className="material-icons text-base mr-2">edit</span>Editar
                        </button>
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleToggleProgramStatus(program.id, program.active)}
                        >
                          <span className="material-icons text-base mr-2">
                            {programStatus === "paused" ? "play_circle" : "pause_circle"}
                          </span>
                          {programStatus === "paused" ? "Activar" : "Pausar"}
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left" onClick={() => handleDeleteProgram(program.id)}>
                          <span className="material-icons text-base mr-2">delete</span>Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Clientes</p>
                      <p className="text-2xl font-semibold text-gray-800">{program.totalCustomers ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Visitas</p>
                      <p className="text-2xl font-semibold text-gray-800">{program.totalPoints ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                      onClick={() => router.push(`/loyalty/program/${program.id}`)}
                    >
                      Ver Detalles
                      <span className="material-icons text-lg ml-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
                <div className={
                  programStatus === "active"
                    ? "bg-blue-500 h-2"
                    : programStatus === "paused"
                    ? "bg-yellow-400 h-2"
                    : "bg-gray-300 h-2"
                }></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default ProgramsPage 