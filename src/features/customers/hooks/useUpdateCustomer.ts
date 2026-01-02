import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../../../api/customers.api';
import type { UpdateCustomerDTO } from '../../../types';

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDTO }) => 
      customersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};
