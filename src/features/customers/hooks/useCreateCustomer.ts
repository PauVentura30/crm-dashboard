import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '../../../api/customers.api';
import type { CreateCustomerDTO } from '../../../types';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDTO) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};
