// src/modules/people/store/usePersonStore.ts

import { create } from "zustand";

import { personService } from "../services/personService";
import type {
  Language,
  Person,
  PersonPayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchPeopleParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

type FetchLanguagesParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

type PersonStore = {
  people: Person[];
  selectedPerson: Person | null;

  languages: Language[];

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  loading: boolean;
  saving: boolean;
  loadingLanguages: boolean;
  updatingStateUuid: string | null;

  fetchPeople: (params?: FetchPeopleParams) => Promise<void>;

  fetchPerson: (uuid: string) => Promise<void>;

  createPerson: (
    payload: PersonPayload
  ) => Promise<void>;

  updatePerson: (
    uuid: string,
    payload: PersonPayload
  ) => Promise<void>;

  deletePerson: (
    uuid: string
  ) => Promise<void>;

  deletePersonImage: (
    personUuid: string,
    imageUuid: string
  ) => Promise<void>;

  togglePersonState: (
    uuid: string,
    state: boolean
  ) => Promise<void>;

  fetchLanguages: (
    params?: FetchLanguagesParams
  ) => Promise<void>;

  clearSelectedPerson: () => void;
  clearPeople: () => void;
  clearLanguages: () => void;
};

export const usePersonStore = create<PersonStore>(
  (set, get) => ({
    people: [],
    selectedPerson: null,

    languages: [],

    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,

    loading: false,
    saving: false,
    loadingLanguages: false,
    updatingStateUuid: null,

    fetchPeople: async (params = {}) => {
      try {
        set({
          loading: true,
        });

        const page =
          params.page ?? get().currentPage;

        const perPage =
          params.perPage ?? get().perPage;

        const search =
          params.search ?? "";

        const response =
          await personService.getPeople({
            page,
            per_page: perPage,
            search,
          });

        const peopleData =
          response?.data?.data ??
          response?.data ??
          [];

        const paginationData =
          response?.data?.data
            ? response.data
            : response?.meta
              ? response.meta
              : response?.data ?? {};

        set({
          people: Array.isArray(peopleData)
            ? peopleData
            : [],

          currentPage:
            paginationData?.current_page ??
            page,

          totalPages:
            paginationData?.last_page ??
            1,

          perPage: Number(
            paginationData?.per_page ??
              perPage
          ),

          total:
            paginationData?.total ??
            (Array.isArray(peopleData)
              ? peopleData.length
              : 0),
        });
      } catch (error) {
        console.error(
          "Error fetchPeople:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchPerson: async (uuid) => {
      try {
        set({
          loading: true,
          selectedPerson: null,
        });

        const response =
          await personService.getPerson(uuid);

        const personData =
          response?.data?.person ??
          response?.data?.data ??
          response?.data ??
          response?.person ??
          null;

        set({
          selectedPerson: personData,
        });
      } catch (error) {
        console.error(
          "Error fetchPerson:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    createPerson: async (payload) => {
      try {
        set({
          saving: true,
        });

        const response =
          await personService.createPerson(
            payload
          );

        showSuccess(
          response?.message ??
            "Persona creada correctamente."
        );
      } catch (error) {
        console.error(
          "Error createPerson:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    updatePerson: async (
      uuid,
      payload
    ) => {
      try {
        set({
          saving: true,
        });

        const response =
          await personService.updatePerson(
            uuid,
            payload
          );

        showSuccess(
          response?.message ??
            "Persona actualizada correctamente."
        );

        const updatedPerson =
          response?.data?.person ??
          response?.data?.data ??
          response?.data ??
          response?.person ??
          null;

        if (
          updatedPerson &&
          typeof updatedPerson === "object"
        ) {
          set((store) => ({
            selectedPerson:
              store.selectedPerson?.uuid ===
              uuid
                ? updatedPerson
                : store.selectedPerson,

            people: store.people.map(
              (person) =>
                person.uuid === uuid
                  ? updatedPerson
                  : person
            ),
          }));
        }
      } catch (error) {
        console.error(
          "Error updatePerson:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    deletePerson: async (uuid) => {
      try {
        set({
          loading: true,
        });

        const response =
          await personService.deletePerson(
            uuid
          );

        showSuccess(
          response?.message ??
            "Persona eliminada correctamente."
        );

        set((store) => ({
          people: store.people.filter(
            (person) =>
              person.uuid !== uuid
          ),

          selectedPerson:
            store.selectedPerson?.uuid ===
            uuid
              ? null
              : store.selectedPerson,
        }));
      } catch (error) {
        console.error(
          "Error deletePerson:",
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

    deletePersonImage: async (
      personUuid,
      imageUuid
    ) => {
      try {
        set({
          saving: true,
        });

        const response =
          await personService.deletePersonImage(
            personUuid,
            imageUuid
          );

        showSuccess(
          response?.message ??
            "Imagen eliminada correctamente."
        );

        set((store) => ({
          selectedPerson:
            store.selectedPerson?.uuid ===
            personUuid
              ? {
                  ...store.selectedPerson,

                  images:
                    store.selectedPerson.images?.filter(
                      (image) => {
                        if (
                          typeof image ===
                          "string"
                        ) {
                          return true;
                        }

                        return (
                          image.uuid !==
                          imageUuid
                        );
                      }
                    ),
                }
              : store.selectedPerson,

          people: store.people.map(
            (person) => {
              if (
                person.uuid !== personUuid
              ) {
                return person;
              }

              return {
                ...person,

                images:
                  person.images?.filter(
                    (image) => {
                      if (
                        typeof image ===
                        "string"
                      ) {
                        return true;
                      }

                      return (
                        image.uuid !==
                        imageUuid
                      );
                    }
                  ),
              };
            }
          ),
        }));
      } catch (error) {
        console.error(
          "Error deletePersonImage:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          saving: false,
        });
      }
    },

    togglePersonState: async (
      uuid,
      state
    ) => {
      const previousPeople =
        get().people;

      const previousSelectedPerson =
        get().selectedPerson;

      try {
        set({
          updatingStateUuid: uuid,
        });

        /*
         * El endpoint recibe { state },
         * pero el listado trabaja con active.
         *
         * Actualizamos solamente la persona
         * seleccionada dentro del array.
         */
        set((store) => ({
          people: store.people.map(
            (person) =>
              person.uuid === uuid
                ? {
                    ...person,
                    active: state,
                  }
                : person
          ),

          selectedPerson:
            store.selectedPerson?.uuid ===
            uuid
              ? {
                  ...store.selectedPerson,
                  active: state,
                }
              : store.selectedPerson,
        }));

        const response =
          await personService.updatePersonState(
            uuid,
            {
              state,
            }
          );

        /*
         * El backend devuelve el estado final
         * dentro de response.data.
         */
        const updatedState =
          typeof response?.data === "boolean"
            ? response.data
            : state;

        /*
         * Confirmamos en el store el valor
         * final retornado por el backend.
         */
        set((store) => ({
          people: store.people.map(
            (person) =>
              person.uuid === uuid
                ? {
                    ...person,
                    active: updatedState,
                  }
                : person
          ),

          selectedPerson:
            store.selectedPerson?.uuid ===
            uuid
              ? {
                  ...store.selectedPerson,
                  active: updatedState,
                }
              : store.selectedPerson,
        }));

        showSuccess(
          response?.message ??
            (updatedState
              ? "Persona habilitada correctamente."
              : "Persona deshabilitada correctamente.")
        );
      } catch (error) {
        console.error(
          "Error togglePersonState:",
          error
        );

        /*
         * Si falla el endpoint, restauramos
         * todos los valores anteriores.
         */
        set({
          people: previousPeople,
          selectedPerson:
            previousSelectedPerson,
        });

        handleApiError(error);
        throw error;
      } finally {
        set({
          updatingStateUuid: null,
        });
      }
    },

    fetchLanguages: async (
      params = {}
    ) => {
      try {
        set({
          loadingLanguages: true,
        });

        const response =
          await personService.getLanguages({
            page: params.page ?? 1,
            per_page:
              params.perPage ?? 100,
            search:
              params.search ?? "",
          });

        const languagesData =
          response?.data?.data ??
          response?.data ??
          [];

        set({
          languages: Array.isArray(
            languagesData
          )
            ? languagesData
            : [],
        });
      } catch (error) {
        console.error(
          "Error fetchLanguages:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loadingLanguages: false,
        });
      }
    },

    clearSelectedPerson: () => {
      set({
        selectedPerson: null,
      });
    },

    clearPeople: () => {
      set({
        people: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
      });
    },

    clearLanguages: () => {
      set({
        languages: [],
      });
    },
  })
);
