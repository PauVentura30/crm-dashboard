// 
import { useState, type FormEvent } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  login({ email, password });
};

  return (
    <div className="min-h-screen bg-claude-bg flex items-center justify-center p-4">
      <div className="bg-claude-surface p-8 rounded-xl border border-claude-border w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-claude-primary p-3 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-claude-text mb-6 text-center">CRM Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-claude-text mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              placeholder="admin@crm.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-claude-text mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              placeholder="admin123"
              required
            />
          </div>
          {loginError && (
            <p className="text-red-400 text-sm">{(loginError as Error).message}</p>
          )}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-claude-primary text-white py-2 rounded-lg font-medium hover:bg-claude-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoggingIn ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="mt-4 text-sm text-claude-text-muted text-center">
          Demo: admin@crm.com / admin123
        </p>
      </div>
    </div>
  );
};
