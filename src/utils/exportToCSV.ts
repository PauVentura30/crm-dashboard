import type { Customer } from '../types';

export const exportToCSV = (customers: Customer[], filename: string = 'clientes.csv') => {
  const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Estado', 'Fecha Creación', 'Último Contacto', 'Notas'];
  
  const rows = customers.map(c => [
    c.name,
    c.email,
    c.phone,
    c.company,
    c.status,
    new Date(c.createdAt).toLocaleDateString('es-ES'),
    c.lastContact ? new Date(c.lastContact).toLocaleDateString('es-ES') : '-',
    c.notes || '-'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
