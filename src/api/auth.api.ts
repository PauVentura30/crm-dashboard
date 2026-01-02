import type { LoginCredentials, AuthResponse } from '../types';
import { mockUser } from './mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const authApi = {
  login: async (creds: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);
    if (creds.email === 'admin@crm.com' && creds.password === 'admin123') {
      return { user: mockUser, token: 'mock-token-' + Date.now() };
    }
    throw new Error('Credenciales inválidas');
  },
  logout: async () => { await delay(300); },
  getCurrentUser: async (): Promise<AuthResponse> => {
    await delay(500);
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');
    return { user: mockUser, token };
  }
};
