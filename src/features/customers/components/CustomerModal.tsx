import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormData } from '../../../schemas/customer.schema';
import type { Customer } from '../../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  customer?: Customer;
  isLoading: boolean;
}

export const CustomerModal = ({ isOpen, onClose, onSubmit, customer, isLoading }: CustomerModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'pending',
      notes: ''
    }
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        status: customer.status,
        notes: customer.notes || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'pending',
        notes: ''
      });
    }
  }, [customer, reset]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-claude-surface rounded-xl border border-claude-border w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-claude-text mb-4">
            {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Nombre *</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Teléfono *</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+34 600 123 456"
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Empresa *</label>
              <input
                {...register('company')}
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
              />
              {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Estado *</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text"
              >
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-claude-text mb-1">Notas</label>
              <textarea
                {...register('notes')}
                className="w-full px-3 py-2 bg-claude-bg border border-claude-border rounded-lg focus:ring-2 focus:ring-claude-primary focus:border-transparent text-claude-text placeholder-claude-text-muted"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-claude-border rounded-lg font-medium text-claude-text hover:bg-claude-surface-hover transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-claude-primary text-white rounded-lg font-medium hover:bg-claude-primary-hover disabled:opacity-50 transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
