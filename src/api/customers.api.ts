import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '../types';
import { getCustomersStore, addToCustomersStore, updateInCustomersStore, removeFromCustomersStore } from './mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    await delay(600);
    return getCustomersStore();
  },
  create: async (data: CreateCustomerDTO): Promise<Customer> => {
    await delay(700);
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    addToCustomersStore(newCustomer);
    return newCustomer;
  },
  update: async (id: string, data: UpdateCustomerDTO): Promise<Customer> => {
    await delay(600);
    const customer = getCustomersStore().find(c => c.id === id);
    if (!customer) throw new Error('No encontrado');
    const updated = { ...customer, ...data };
    updateInCustomersStore(id, data);
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    await delay(500);
    removeFromCustomersStore(id);
  }
};
