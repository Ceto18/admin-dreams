// src/modules/company/services/socialNetworkProfileService.ts

import { api } from "@/services/api";

import type {
  SocialNetworkProfilePayload,
  SocialNetworkProfileResponse,
  SocialNetworkProfilesResponse,
  SocialNetworksResponse,
} from "../types";

export type GetSocialNetworkProfilesParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

interface DeleteSocialNetworkProfileResponse {
  success: boolean;
  message: string;
  data?: null;
}

export const socialNetworkProfileService = {
  getProfiles: async (
    params: GetSocialNetworkProfilesParams = {}
  ): Promise<SocialNetworkProfilesResponse> => {
    const response =
      await api.get<SocialNetworkProfilesResponse>(
        "/admin/social-network-profiles",
        {
          params,
        }
      );

    return response.data;
  },

  getProfile: async (
    uuid: string
  ): Promise<SocialNetworkProfileResponse> => {
    const response =
      await api.get<SocialNetworkProfileResponse>(
        `/admin/social-network-profiles/${uuid}`
      );

    return response.data;
  },

  getSocialNetworks:
    async (): Promise<SocialNetworksResponse> => {
      const response =
        await api.get<SocialNetworksResponse>(
          "/admin/social-networks"
        );

      return response.data;
    },

  createProfile: async (
    payload: SocialNetworkProfilePayload
  ): Promise<SocialNetworkProfileResponse> => {
    const response =
      await api.post<SocialNetworkProfileResponse>(
        "/admin/social-network-profiles",
        payload
      );

    return response.data;
  },

  updateProfile: async (
    uuid: string,
    payload: SocialNetworkProfilePayload
  ): Promise<SocialNetworkProfileResponse> => {
    const response =
      await api.put<SocialNetworkProfileResponse>(
        `/admin/social-network-profiles/${uuid}`,
        payload
      );

    return response.data;
  },

  deleteProfile: async (
    uuid: string
  ): Promise<DeleteSocialNetworkProfileResponse> => {
    const response =
      await api.delete<DeleteSocialNetworkProfileResponse>(
        `/admin/social-network-profiles/${uuid}`
      );

    return response.data;
  },
};