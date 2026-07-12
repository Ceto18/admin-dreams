// src/app/(admin)/people/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import type { Person } from "@/modules/collaborators/types";

import PersonTable from "@/modules/collaborators/components/PersonTable";
import { usePersonStore } from "@/modules/collaborators/store/usePersonStore";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando personas...
        </span>
      </div>
    </div>
  );
}

export default function PeoplePage() {
  const router = useRouter();

  const {
    people,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchPeople,
    deletePerson,
    togglePersonState,
  } = usePersonStore();

  const [search, setSearch] = useState("");
  const [personToDelete, setPersonToDelete] =
    useState<Person | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPeople({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchPeople]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchPeople({
      page: 1,
      perPage,
      search: search.trim(),
    });
  };

  const handlePageChange = (page: number) => {
    fetchPeople({
      page,
      perPage,
      search: search.trim(),
    });
  };

  const handlePerPageChange = (
    newPerPage: number
  ) => {
    fetchPeople({
      page: 1,
      perPage: newPerPage,
      search: search.trim(),
    });
  };

  const handleView = (person: Person) => {
    router.push(
      `/collaborators/${person.uuid}`
    );
  };

  const handleOpenCreate = () => {
    router.push("/collaborators/create");
  };

  const handleOpenEdit = (
    person: Person
  ) => {
    router.push(
      `/collaborators/${person.uuid}/edit`
    );
  };

  const handleDelete = (person: Person) => {
    setPersonToDelete(person);
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;

    try {
      await deletePerson(
        personToDelete.uuid
      );

      setPersonToDelete(null);

      await fetchPeople({
        page: currentPage,
        perPage,
        search: search.trim(),
      });
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setPersonToDelete(null);
  };

  const handleToggleState = async (
    person: Person,
    state: boolean
  ) => {
    try {
      await togglePersonState(
        person.uuid,
        state
      );
    } catch {
      // El error ya se maneja en el store.
      // Si falla, el store restaura el estado anterior.
    }
  };

  const personToDeleteName =
    personToDelete?.full_name ||
    personToDelete?.fullname ||
    `${personToDelete?.first_name ?? ""} ${
      personToDelete?.last_name ?? ""
    }`.trim();

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Personas"
        description="Administra las personas, sus misiones, especialidades e idiomas."
        addLabel="Nueva persona"
        onAdd={handleOpenCreate}
        searchValue={search}
        searchPlaceholder="Buscar persona..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <PersonTable
          data={people}
          loading={false}
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleState={
            handleToggleState
          }
          showView
          showEdit
          showDelete
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[
          10,
          25,
          50,
          100,
        ]}
        onPageChange={
          handlePageChange
        }
        onPerPageChange={
          handlePerPageChange
        }
      />

      <ConfirmModal
        open={Boolean(
          personToDelete
        )}
        title="Eliminar persona"
        message={`¿Seguro que deseas eliminar la persona "${
          personToDeleteName || ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={
          handleConfirmDelete
        }
        onCancel={
          handleCancelDelete
        }
      />
    </div>
  );
}
