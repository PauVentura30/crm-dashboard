import type { User, Customer } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'admin@crm.com',
  name: 'Admin User',
  role: 'admin'
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Juan García',
    email: 'juan@example.com',
    phone: '+34 600 123 456',
    company: 'Tech Solutions',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastContact: '2025-01-01T14:00:00Z',
    notes: 'Cliente VIP'
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria@example.com',
    phone: '+34 600 234 567',
    company: 'Marketing Pro',
    status: 'active',
    createdAt: '2024-02-10T09:15:00Z',
    lastContact: '2024-12-28T11:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Martínez',
    email: 'carlos@example.com',
    phone: '+34 600 345 678',
    company: 'Innovación Digital',
    status: 'pending',
    createdAt: '2024-03-05T16:45:00Z'
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    email: 'ana@example.com',
    phone: '+34 600 456 789',
    company: 'Consultores SA',
    status: 'active',
    createdAt: '2024-04-20T08:00:00Z',
    lastContact: '2024-12-30T16:20:00Z'
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    phone: '+34 600 567 890',
    company: 'DevOps Team',
    status: 'inactive',
    createdAt: '2024-05-12T14:30:00Z',
    lastContact: '2024-08-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Laura Fernández',
    email: 'laura@example.com',
    phone: '+34 600 678 901',
    company: 'Design Studio',
    status: 'active',
    createdAt: '2024-06-08T11:20:00Z',
    lastContact: '2024-12-29T09:45:00Z'
  },
  {
    id: '7',
    name: 'Javier Ruiz',
    email: 'javier@example.com',
    phone: '+34 600 789 012',
    company: 'Cloud Services',
    status: 'pending',
    createdAt: '2024-07-14T15:10:00Z'
  },
  {
    id: '8',
    name: 'Carmen Díaz',
    email: 'carmen@example.com',
    phone: '+34 600 890 123',
    company: 'Legal Advisors',
    status: 'active',
    createdAt: '2024-08-22T10:50:00Z',
    lastContact: '2025-01-02T12:30:00Z'
  },
  {
    id: '9',
    name: 'Miguel Ángel Torres',
    email: 'miguel@example.com',
    phone: '+34 600 901 234',
    company: 'Fintech Solutions',
    status: 'active',
    createdAt: '2024-09-03T13:40:00Z',
    lastContact: '2024-12-27T15:10:00Z'
  },
  {
    id: '10',
    name: 'Isabel Moreno',
    email: 'isabel@example.com',
    phone: '+34 600 012 345',
    company: 'HR Consulting',
    status: 'inactive',
    createdAt: '2024-10-18T09:25:00Z',
    lastContact: '2024-11-20T14:00:00Z'
  },
  {
    id: '11',
    name: 'Francisco Jiménez',
    email: 'francisco@example.com',
    phone: '+34 600 123 456',
    company: 'E-commerce Plus',
    status: 'active',
    createdAt: '2024-11-05T16:15:00Z',
    lastContact: '2024-12-31T10:20:00Z'
  },
  {
    id: '12',
    name: 'Sofía Romero',
    email: 'sofia@example.com',
    phone: '+34 600 234 567',
    company: 'Media Group',
    status: 'pending',
    createdAt: '2024-12-01T12:00:00Z'
  }
];

let customersStore = [...mockCustomers];

export const getCustomersStore = () => customersStore;
export const addToCustomersStore = (c: Customer) => customersStore.push(c);
export const updateInCustomersStore = (id: string, u: Partial<Customer>) => {
  const i = customersStore.findIndex(c => c.id === id);
  if (i !== -1) customersStore[i] = { ...customersStore[i], ...u };
};
export const removeFromCustomersStore = (id: string) => {
  customersStore = customersStore.filter(c => c.id !== id);
};
