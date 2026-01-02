import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Plus, Download, Filter, X, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCustomers } from '../features/customers/hooks/useCustomers';
import { useCreateCustomer } from '../features/customers/hooks/useCreateCustomer';
import { useUpdateCustomer } from '../features/customers/hooks/useUpdateCustomer';
import { useDeleteCustomer } from '../features/customers/hooks/useDeleteCustomer';
import { CustomerModal } from '../features/customers/components/CustomerModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { SkeletonTable } from '../components/SkeletonTable';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { exportToCSV } from '../utils/exportToCSV';
import type { Customer } from '../types';
import type { CustomerFormData } from '../schemas/customer.schema';

export const CustomersPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [deletingCustomer, setDeletingCustomer] = useState<{ id: string; name: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    let filtered = customers;

    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    return filtered;
  }, [customers, debouncedSearch, statusFilter]);

  const {
    paginatedItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    totalItems
  } = usePagination(filteredCustomers, 10);

  useKeyboardShortcuts({
    'n': () => handleCreate(),
    '/': () => document.getElementById('search-input')?.focus()
  });

  const handleCreate = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeletingCustomer({ id, name });
  };

  const handleDeleteConfirm = () => {
    if (!deletingCustomer) return;
    
    toast.promise(
      deleteMutation.mutateAsync(deletingCustomer.id),
      {
        loading: 'Eliminando...',
        success: 'Cliente eliminado correctamente',
        error: 'Error al eliminar el cliente'
      }
    ).then(() => setDeletingCustomer(null));
  };

  const handleSubmit = (data: CustomerFormData) => {
    if (editingCustomer) {
      toast.promise(
        updateMutation.mutateAsync({ id: editingCustomer.id, data }),
        {
          loading: 'Actualizando...',
          success: 'Cliente actualizado correctamente',
          error: 'Error al actualizar el cliente'
        }
      ).then(() => setIsModalOpen(false));
    } else {
      toast.promise(
        createMutation.mutateAsync(data),
        {
          loading: 'Creando...',
          success: 'Cliente creado correctamente',
          error: 'Error al crear el cliente'
        }
      ).then(() => setIsModalOpen(false));
    }
  };

  const handleExport = () => {
    if (!filteredCustomers.length) {
      toast.error('No hay clientes para exportar');
      return;
    }
    exportToCSV(filteredCustomers);
    toast.success('Archivo CSV descargado');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-claude-bg">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2e2e2e',
            color: '#e8e8e8',
            border: '1px solid #404040'
          }
        }}
      />
      
      <header className="bg-claude-surface border-b border-claude-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-claude-primary p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-claude-text">Clientes</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-claude-text-muted hover:text-claude-text transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-claude-text-muted">
              Hola, <span className="font-semibold text-claude-text">{currentUser?.name}</span>
            </span>
            <button onClick={logout} className="text-sm text-red-400 font-medium hover:text-red-300 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-claude-surface rounded-xl border border-claude-border">
          {/* Toolbar */}
          <div className="p-6 border-b border-claude-border">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-claude-text-muted w-5 h-5" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Buscar por nombre, email o empresa... (Press /)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent transition-all text-claude-text placeholder-claude-text-muted"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 border rounded-lg font-medium transition-all flex items-center gap-2 ${
                    showFilters 
                      ? 'bg-claude-primary/20 text-claude-primary border-claude-primary/30' 
                      : 'border-claude-border text-claude-text hover:bg-claude-surface-hover'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2.5 border border-claude-border rounded-lg font-medium text-claude-text hover:bg-claude-surface-hover transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-claude-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-claude-primary-hover transition-all flex items-center gap-2 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Cliente
                </button>
              </div>

              {/* Filtros */}
              {showFilters && (
                <div className="flex items-center gap-2 p-4 bg-claude-bg rounded-lg border border-claude-border">
                  <span className="text-sm font-medium text-claude-text">Estado:</span>
                  {(['all', 'active', 'pending', 'inactive'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-claude-primary text-white'
                          : 'bg-claude-surface text-claude-text hover:bg-claude-surface-hover border border-claude-border'
                      }`}
                    >
                      {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : status === 'pending' ? 'Pendientes' : 'Inactivos'}
                    </button>
                  ))}
                  {statusFilter !== 'all' && (
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-2 text-claude-text-muted hover:text-claude-text transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <SkeletonTable />
          ) : filteredCustomers.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-block p-4 bg-claude-surface-hover rounded-full mb-4">
                <Users className="w-12 h-12 text-claude-text-muted" />
              </div>
              <p className="text-claude-text text-lg font-medium mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No se encontraron clientes' : 'No hay clientes todavía'}
              </p>
              <p className="text-claude-text-muted text-sm mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Crea tu primer cliente para empezar'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={handleCreate}
                  className="bg-claude-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-claude-primary-hover transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear Primer Cliente
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-claude-surface-hover">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-claude-text-muted uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-claude-text-muted uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-claude-text-muted uppercase tracking-wider">Teléfono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-claude-text-muted uppercase tracking-wider">Empresa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-claude-text-muted uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-claude-text-muted uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-claude-border">
                    {paginatedItems.map((customer, index) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-claude-surface-hover transition-colors"
                        style={{ 
                          animation: 'fadeIn 0.3s ease-in',
                          animationDelay: `${index * 30}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-claude-primary/20 rounded-full flex items-center justify-center border border-claude-primary/30">
                              <span className="text-claude-primary font-semibold text-xs">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                            <div className="font-medium text-claude-text">{customer.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-claude-text-muted">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-claude-text-muted">
                          {customer.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-claude-text-muted">
                          {customer.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                            {getStatusText(customer.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-claude-primary hover:text-claude-primary-hover font-medium mr-4 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer.id, customer.name)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-claude-border flex items-center justify-between bg-claude-surface-hover">
                  <div className="text-sm text-claude-text-muted">
                    Mostrando <span className="font-medium text-claude-text">{startIndex}</span> - <span className="font-medium text-claude-text">{endIndex}</span> de <span className="font-medium text-claude-text">{totalItems}</span> clientes
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevPage}
                      disabled={!hasPrev}
                      className="px-4 py-2 border border-claude-border rounded-lg text-sm font-medium text-claude-text hover:bg-claude-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ← Anterior
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              page === currentPage
                                ? 'bg-claude-primary text-white'
                                : 'text-claude-text hover:bg-claude-surface border border-claude-border'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={!hasNext}
                      className="px-4 py-2 border border-claude-border rounded-lg text-sm font-medium text-claude-text hover:bg-claude-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        customer={editingCustomer}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar cliente"
        message={`¿Estás seguro de que quieres eliminar a ${deletingCustomer?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
