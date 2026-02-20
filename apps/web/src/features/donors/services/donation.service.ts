import { apiClient } from '../../../shared/api/client';
import { Donation } from '../types/donation';

export const donationService = {
  register: async (donation: Donation) => {
    const response = await apiClient.post('/donations', donation);
    return response.data;
  },
};
