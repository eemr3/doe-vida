import axios from 'axios';
import { apiClient } from '@/shared/api/client';
import type { Donor, DonorFormData } from '../types';
import {
  DonorsApiItem,
  DonorsApiResponse,
  GetDonorByIdApiResponse,
  RegisterDonorApiRequest,
  RegisterDonorApiResponse,
} from '../types/donor';
import { bloodTypeFromApi, bloodTypeToApi } from '../utils';

function mapGetDonorByIdToDonor(data: GetDonorByIdApiResponse): Donor {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    bloodType: bloodTypeFromApi(data.bloodType),
    birthDate: '',
    age: data.age,
    weight: data.weight,
    city: data.city,
    lastDonation: data.lastDonation ?? null,
    registrationDate: data.registeredAt ?? '',
    eligible: data.eligible,
    nextDonationDate: data.nextDonationDate ?? null,
    donationHistory: (data.donationHistory ?? []).map((d) => ({
      date: d.date,
      location: d.location,
    })),
  };
}

function mapApiItemToDonor(item: DonorsApiItem): Donor {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    bloodType: bloodTypeFromApi(item.bloodType),
    birthDate: '',
    age: item.age,
    weight: item.weight,
    city: item.city,
    lastDonation: item.lastDonation ?? null,
    registrationDate: item.registeredAt ?? '',
    eligible: item.eligible,
    nextDonationDate: null,
    donationHistory: [],
  };
}

export interface ListDonorsParams {
  page?: number;
  pageSize?: number;
  city?: string;
  bloodType?: string;
  eligible?: boolean | null;
  search?: string;
}

/** Serviço de doadores. Substituir por chamadas axios quando houver API. */
export const donorsService = {
  async list(
    params: ListDonorsParams = {},
  ): Promise<{ items: Donor[]; totalCount: number }> {
    const { data } = await apiClient.get<DonorsApiResponse>('/donors', {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        city: params.city || undefined,
        bloodType: params.bloodType ? bloodTypeToApi(params.bloodType) : undefined,
        eligible: params.eligible ?? undefined,
        search: params.search ?? undefined,
      },
    });

    console.log(data);
    return {
      items: data.items.map(mapApiItemToDonor),
      totalCount: data.totalCount,
    };
  },

  async getById(id: string): Promise<Donor | null> {
    try {
      const { data } = await apiClient.get<GetDonorByIdApiResponse>(`/api/donors/${id}`);
      return mapGetDonorByIdToDonor(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      throw err;
    }
  },

  async register(formData: DonorFormData): Promise<{ id: string }> {
    const body: RegisterDonorApiRequest = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: new Date(formData.birthDate).toISOString(),
      city: formData.city.trim(),
      bloodType: bloodTypeToApi(formData.bloodType),
      weight: parseFloat(formData.weight),
    };
    if (formData.lastDonation?.trim()) {
      body.dateOfLastDonation = new Date(formData.lastDonation.trim()).toISOString();
      if (formData.lastDonationLocation?.trim()) {
        body.lastDonationLocation = formData.lastDonationLocation.trim();
      }
    }
    const { data } = await apiClient.post<RegisterDonorApiResponse>('/api/donors', body);
    return { id: data.id };
  },
};
