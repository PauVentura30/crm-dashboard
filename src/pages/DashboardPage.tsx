import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useCustomers } from '../features/customers/hooks/useCustomers';
import { useAuth } from '../features/auth/hooks/useAuth';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading } = useCustomers();
  const { currentUser, logout } = useAuth();

  const stats = {
    total: customers?.length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
    pending: customers?.filter(c => c.status === 'pending').length || 0,
    inactive: customers?.filter(c => c.status === 'inactive').length || 0,
  };

  const recentCustomers = customers
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  const evolutionData = [
    { mes: 'Jul', clientes: 2 },
    { mes: 'Ago', clientes: 3 },
    { mes: 'Sep', clientes: 5 },
    { mes: 'Oct', clientes: 7 },
    { mes: 'Nov', clientes: 9 },
    { mes: 'Dic', clientes: 12 }
  ];

  const pieData = [
    { name: 'Activos', value: stats.active, color: '#10b981' },
    { name: 'Pendientes', value: stats.pending, color: '#f59e0b' },
    { name: 'Inactivos', value: stats.inactive, color: '#6b7280' }
  ];

  return (
    <div className="min-h-screen bg-claude-bg">
      <header className="bg-claude-surface border-b border-claude-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-claude-primary p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-claude-text">CRM Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-claude-text-muted">
              Hola, <span className="font-semibold text-claude-text">{currentUser?.name}</span>
            </span>
            <button 
              onClick={logout} 
              className="text-sm text-red-400 font-medium hover:text-red-300 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-claude-border border-t-claude-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-claude-primary animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border hover:bg-claude-surface-hover transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-claude-text-muted font-medium">Total Clientes</p>
                  <Users className="w-5 h-5 text-claude-primary" />
                </div>
                <p className="text-3xl font-bold text-claude-text">{stats.total}</p>
                <p className="text-xs text-claude-text-muted mt-1">Base de clientes</p>
              </div>
              
              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border hover:bg-claude-surface-hover transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-claude-text-muted font-medium">Activos</p>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                <p className="text-xs text-claude-text-muted mt-1">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total
                </p>
              </div>
              
              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border hover:bg-claude-surface-hover transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-claude-text-muted font-medium">Pendientes</p>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                <p className="text-xs text-claude-text-muted mt-1">Requieren atención</p>
              </div>
              
              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border hover:bg-claude-surface-hover transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-claude-text-muted font-medium">Inactivos</p>
                  <AlertCircle className="w-5 h-5 text-claude-text-muted" />
                </div>
                <p className="text-3xl font-bold text-claude-text-muted">{stats.inactive}</p>
                <p className="text-xs text-claude-text-muted mt-1">Sin actividad reciente</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border">
                <h2 className="text-lg font-bold text-claude-text mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-claude-primary" />
                  Evolución de Clientes
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="mes" stroke="#999999" />
                    <YAxis stroke="#999999" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#2e2e2e', 
                        border: '1px solid #404040',
                        borderRadius: '8px',
                        color: '#e8e8e8'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clientes" 
                      stroke="#c17f3e" 
                      strokeWidth={3}
                      dot={{ fill: '#c17f3e', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border">
                <h2 className="text-lg font-bold text-claude-text mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-claude-primary" />
                  Distribución por Estado
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name} ${entry.percent ? (entry.percent * 100).toFixed(0) : 0}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#2e2e2e', 
                        border: '1px solid #404040',
                        borderRadius: '8px',
                        color: '#e8e8e8'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-claude-surface p-6 rounded-xl border border-claude-border">
                <h2 className="text-lg font-bold text-claude-text mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-claude-primary" />
                  Actividad Reciente
                </h2>
                <div className="space-y-3">
                  {recentCustomers.map((customer, index) => (
                    <div 
                      key={customer.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-claude-surface-hover transition-colors border border-claude-border"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-claude-primary/20 rounded-full flex items-center justify-center border border-claude-primary/30">
                          <span className="text-claude-primary font-semibold text-sm">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-claude-text">{customer.name}</p>
                          <p className="text-xs text-claude-text-muted">{customer.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          customer.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          customer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {customer.status === 'active' ? 'Activo' : customer.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </span>
                        <p className="text-xs text-claude-text-muted mt-1">
                          {new Date(customer.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-claude-surface p-6 rounded-xl border border-claude-border">
                <h2 className="text-lg font-bold text-claude-text mb-4">Acciones Rápidas</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/customers')}
                    className="w-full bg-claude-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-claude-primary-hover transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Ver Todos los Clientes
                  </button>
                  <div className="pt-4 border-t border-claude-border">
                    <p className="text-sm text-claude-text-muted mb-2">Atajos de teclado:</p>
                    <ul className="text-xs space-y-1 text-claude-text-muted">
                      <li>• <kbd className="bg-claude-surface-hover px-2 py-1 rounded border border-claude-border">N</kbd> Nuevo cliente</li>
                      <li>• <kbd className="bg-claude-surface-hover px-2 py-1 rounded border border-claude-border">/</kbd> Buscar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
