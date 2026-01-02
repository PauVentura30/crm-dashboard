import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth.api';
import type { LoginCredentials } from '../../../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['currentUser'], data);
      navigate('/dashboard');
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.clear();
      navigate('/login');
    }
  });

  return {
    currentUser: authData?.user,
    isAuthenticated: !!authData,
    login: (creds: LoginCredentials) => loginMutation.mutate(creds),
    logout: () => logoutMutation.mutate(),
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error
  };
};
