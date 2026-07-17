// src/modules/company/store/useSocialNetworkProfileStore.ts

import { create } from "zustand";

import { socialNetworkProfileService } from "../services/socialNetworkProfileService";

import type {
  SocialNetwork,
  SocialNetworkProfile,
  SocialNetworkProfilePayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchSocialNetworkProfilesParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

interface SocialNetworkProfileState {
  profiles: SocialNetworkProfile[];
  profile: SocialNetworkProfile | null;

  socialNetworks: SocialNetwork[];

  loading: boolean;
  loadingSocialNetworks: boolean;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchProfiles: (
    params?: FetchSocialNetworkProfilesParams
  ) => Promise<void>;

  fetchProfile: (uuid: string) => Promise<void>;

  fetchSocialNetworks: () => Promise<void>;

  createProfile: (
    payload: SocialNetworkProfilePayload
  ) => Promise<void>;

  updateProfile: (
    uuid: string,
    payload: SocialNetworkProfilePayload
  ) => Promise<void>;

  deleteProfile: (uuid: string) => Promise<void>;

  clearProfile: () => void;
}

export const useSocialNetworkProfileStore =
  create<SocialNetworkProfileState>((set) => ({
    profiles: [],
    profile: null,

    socialNetworks: [],

    loading: false,
    loadingSocialNetworks: false,

    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,

    fetchProfiles: async (params = {}) => {
      try {
        set({
          loading: true,
        });

        const {
          page = 1,
          perPage = 10,
          search = "",
        } = params;

        const response =
          await socialNetworkProfileService.getProfiles({
            page,
            per_page: perPage,
            search,
          });

        const paginationData = response.data;

        set({
          profiles: paginationData.data ?? [],

          currentPage:
            paginationData.current_page ?? 1,

          totalPages:
            paginationData.last_page ?? 1,

          perPage: Number(
            paginationData.per_page ?? perPage
          ),

          total: paginationData.total ?? 0,
        });
      } catch (error) {
        console.error(
          "Error fetchProfiles:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchProfile: async (uuid) => {
      try {
        set({
          loading: true,
          profile: null,
        });

        const response =
          await socialNetworkProfileService.getProfile(
            uuid
          );

        const profileData = response.data;

        const normalizedProfile: SocialNetworkProfile = {
          ...profileData,

          social_network_uuid:
            profileData.social_network?.uuid ??
            profileData.social_network_uuid ??
            undefined,

          social_network_name:
            profileData.social_network?.name ??
            profileData.social_network_name ??
            undefined,
        };

        set({
          profile: normalizedProfile,
        });
      } catch (error) {
        console.error(
          "Error fetchProfile:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchSocialNetworks: async () => {
      try {
        set({
          loadingSocialNetworks: true,
        });

        const response =
          await socialNetworkProfileService.getSocialNetworks();

        set({
          socialNetworks: response.data ?? [],
        });
      } catch (error) {
        console.error(
          "Error fetchSocialNetworks:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loadingSocialNetworks: false,
        });
      }
    },

    createProfile: async (payload) => {
      try {
        set({
          loading: true,
        });

        const response =
          await socialNetworkProfileService.createProfile(
            payload
          );

        showSuccess(
          response.message ??
            "Perfil de red social creado correctamente."
        );

        const createdProfileData = response.data;

        const createdProfile: SocialNetworkProfile = {
          ...createdProfileData,

          social_network_uuid:
            createdProfileData.social_network?.uuid ??
            createdProfileData.social_network_uuid ??
            payload.social_network_uuid,

          social_network_name:
            createdProfileData.social_network?.name ??
            createdProfileData.social_network_name ??
            undefined,
        };

        set((store) => ({
          profiles: [
            createdProfile,
            ...store.profiles,
          ],

          profile: createdProfile,

          total: store.total + 1,
        }));
      } catch (error) {
        console.error(
          "Error createProfile:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    updateProfile: async (
      uuid,
      payload
    ) => {
      try {
        set({
          loading: true,
        });

        const response =
          await socialNetworkProfileService.updateProfile(
            uuid,
            payload
          );

        showSuccess(
          response.message ??
            "Perfil de red social actualizado correctamente."
        );

        const updatedProfileData = response.data;

        const updatedProfile: SocialNetworkProfile = {
          ...updatedProfileData,

          social_network_uuid:
            updatedProfileData.social_network?.uuid ??
            updatedProfileData.social_network_uuid ??
            payload.social_network_uuid,

          social_network_name:
            updatedProfileData.social_network?.name ??
            updatedProfileData.social_network_name ??
            undefined,
        };

        set((store) => ({
          profile:
            store.profile?.uuid === uuid
              ? {
                  ...store.profile,
                  ...updatedProfile,
                }
              : store.profile,

          profiles: store.profiles.map(
            (profile) =>
              profile.uuid === uuid
                ? {
                    ...profile,
                    ...updatedProfile,
                  }
                : profile
          ),
        }));
      } catch (error) {
        console.error(
          "Error updateProfile:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    deleteProfile: async (uuid) => {
      try {
        set({
          loading: true,
        });

        const response =
          await socialNetworkProfileService.deleteProfile(
            uuid
          );

        showSuccess(
          response.message ??
            "Perfil de red social eliminado correctamente."
        );

        set((store) => ({
          profiles: store.profiles.filter(
            (profile) =>
              profile.uuid !== uuid
          ),

          profile:
            store.profile?.uuid === uuid
              ? null
              : store.profile,

          total: Math.max(
            0,
            store.total - 1
          ),
        }));
      } catch (error) {
        console.error(
          "Error deleteProfile:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    clearProfile: () => {
      set({
        profile: null,
      });
    },
  }));