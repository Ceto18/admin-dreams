import { api } from "@/services/api";
import { HomePayload } from "../types";

const buildHomeFormData = (payload: HomePayload) => {
  const formData = new FormData();

  formData.append("hero[title]", payload.hero.title);
  formData.append("hero[highlight_text]", payload.hero.highlight_text);
  formData.append("hero[description]", payload.hero.description);

  formData.append(
    "hero[destinations_count]",
    String(payload.hero.destinations_count)
  );

  formData.append(
    "hero[travelers_count]",
    String(payload.hero.travelers_count)
  );

  formData.append(
    "hero[experiences_count]",
    String(payload.hero.experiences_count)
  );

  formData.append(
    "hero[continents_count]",
    String(payload.hero.continents_count)
  );

  payload.hero.images?.forEach((image, index) => {
    formData.append(`hero[images][${index}]`, image);
  });

  return formData;
};

export const homeService = {
  getHome: async () => {
    const res = await api.get("/admin/home");

    return res.data;
  },

  updateHome: async (payload: HomePayload) => {
    const formData = buildHomeFormData(payload);

    const res = await api.post("/admin/home/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteHeroImage: async (imageUuid: string) => {
    const res = await api.delete(`/admin/home/hero/${imageUuid}`);

    return res.data;
  },
};