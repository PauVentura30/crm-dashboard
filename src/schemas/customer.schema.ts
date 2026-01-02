import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido').regex(/^[+]?[\d\s()-]+$/, 'Formato de teléfono inválido'),
  company: z.string().min(2, 'La empresa debe tener al menos 2 caracteres'),
  status: z.enum(['active', 'inactive', 'pending']),
  notes: z.string().optional()
});

export type CustomerFormData = z.infer<typeof customerSchema>;
