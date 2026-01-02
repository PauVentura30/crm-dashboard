export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastContact?: string;
  notes?: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {
  lastContact?: string;
}
