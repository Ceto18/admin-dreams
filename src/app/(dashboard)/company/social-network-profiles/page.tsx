// src/app/(admin)/company/social-network-profiles/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";


import { useSocialNetworkProfileStore } from "@/modules/company/store/useSocialNetworkProfileStore";

import type {
  SocialNetworkProfile,
} from "@/modules/company/types";
import SocialNetworkProfileTable from "@/modules/company/components/social-network-profiles/SocialNetworkProfileTable";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando perfiles sociales...
        </span>
      </div>
    </div>
  );
}

export default function SocialNetworkProfilesPage() {
  const router = useRouter();

  const {
    profiles,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchProfiles,
    deleteProfile,
  } = useSocialNetworkProfileStore();

  const [search, setSearch] = useState("");

  const [
    profileToDelete,
    setProfileToDelete,
  ] = useState<SocialNetworkProfile | null>(
    null
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchProfiles({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchProfiles]);

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    void fetchProfiles({
      page: 1,
      perPage,
      search: search.trim(),
    });
  };

  const handlePageChange = (
    page: number
  ) => {
    void fetchProfiles({
      page,
      perPage,
      search: search.trim(),
    });
  };

  const handlePerPageChange = (
    newPerPage: number
  ) => {
    void fetchProfiles({
      page: 1,
      perPage: newPerPage,
      search: search.trim(),
    });
  };

  const handleView = (
    profile: SocialNetworkProfile
  ) => {
    router.push(
      `/company/social-network-profiles/${profile.uuid}`
    );
  };

  const handleOpenCreate = () => {
    router.push(
      "/company/social-network-profiles/create"
    );
  };

  const handleOpenEdit = (
    profile: SocialNetworkProfile
  ) => {
    router.push(
      `/company/social-network-profiles/${profile.uuid}/edit`
    );
  };

  const handleDelete = (
    profile: SocialNetworkProfile
  ) => {
    setProfileToDelete(profile);
  };

  const handleConfirmDelete = async () => {
    if (!profileToDelete) return;

    try {
      await deleteProfile(
        profileToDelete.uuid
      );

      setProfileToDelete(null);

      const shouldGoToPreviousPage =
        profiles.length === 1 &&
        currentPage > 1;

      await fetchProfiles({
        page: shouldGoToPreviousPage
          ? currentPage - 1
          : currentPage,
        perPage,
        search: search.trim(),
      });
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setProfileToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Redes sociales"
        description="Administra los perfiles de redes sociales de la empresa."
        addLabel="Nuevo perfil"
        onAdd={handleOpenCreate}
        searchValue={search}
        searchPlaceholder="Buscar perfil social..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <SocialNetworkProfileTable
          data={profiles}
          loading={false}
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          showView={false}
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
        onPageChange={handlePageChange}
        onPerPageChange={
          handlePerPageChange
        }
      />

      <ConfirmModal
        open={Boolean(profileToDelete)}
        title="Eliminar perfil social"
        message={`¿Seguro que deseas eliminar el perfil "${
          profileToDelete?.nickname ?? ""
        }" de ${
          profileToDelete?.social_network_name ??
          "esta red social"
        }? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}