import { useQuery } from '@tanstack/react-query';
import { customersApi } from '../../../api/customers.api';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customersApi.getAll
  });
};
