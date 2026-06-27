import { create } from "zustand";
import { homeService } from "../services/homeService";
import { Home, HomePayload } from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

interface HomeState {
  home: Home | null;
  loading: boolean;
  deletingHeroImageUuid: string | null;

  fetchHome: () => Promise<void>;
  updateHome: (payload: HomePayload) => Promise<void>;
  deleteHeroImage: (imageUuid: string) => Promise<void>;
  clearHome: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  home: null,
  loading: false,
  deletingHeroImageUuid: null,

  fetchHome: async () => {
    try {
      set({ loading: true });

      const response = await homeService.getHome();

      const homeData =
        response?.data?.home ??
        response?.data ??
        response?.home ??
        null;

      set({
        home: homeData,
      });
    } catch (error) {
      console.error("Error fetchHome:", error);
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  updateHome: async (payload) => {
    try {
      set({ loading: true });

      const response = await homeService.updateHome(payload);

      showSuccess(response?.message ?? "Home actualizado correctamente.");

      const homeData =
        response?.data?.home ??
        response?.data ??
        response?.home ??
        null;

      if (homeData) {
        set({
          home: homeData,
        });
      }
    } catch (error) {
      console.error("Error updateHome:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteHeroImage: async (imageUuid) => {
    try {
      set({ deletingHeroImageUuid: imageUuid });

      const response = await homeService.deleteHeroImage(imageUuid);

      showSuccess(response?.message ?? "Imagen eliminada correctamente.");

      set((state) => {
        if (!state.home) return state;

        return {
          home: {
            ...state.home,
            hero: {
              ...state.home.hero,
              images:
                state.home.hero?.images?.filter(
                  (image) => image.uuid !== imageUuid
                ) ?? [],
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleteHeroImage:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ deletingHeroImageUuid: null });
    }
  },

  clearHome: () => {
    set({
      home: null,
      deletingHeroImageUuid: null,
    });
  },
}));