// src/app/(admin)/organizations/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import OrganizationTable from "@/modules/organizations/components/OrganizationTable";
import { useOrganizationStore } from "@/modules/organizations/store/useOrganizationStore";
import { Organization } from "@/modules/organizations/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando organizaciones...
        </span>
      </div>
    </div>
  );
}

export default function OrganizationsPage() {
  const router = useRouter();

  const {
    organizations,
    currentPage,
    totalPages,
    perPage,
    loading,
    fetchOrganizations,
    deleteOrganization,
  } = useOrganizationStore();

  const [search, setSearch] = useState("");
  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);

  useEffect(() => {
    fetchOrganizations({
      page: 1,
      perPage,
      search: "",
    });
  }, [fetchOrganizations, perPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchOrganizations({
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    fetchOrganizations({
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    fetchOrganizations({
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleView = (organization: Organization) => {
    router.push(`/organizations/${organization.uuid}`);
  };

  const handleEdit = (organization: Organization) => {
    router.push(`/organizations/${organization.uuid}/edit`);
  };

  const handleDelete = (organization: Organization) => {
    setOrganizationToDelete(organization);
  };

  const handleConfirmDelete = async () => {
    if (!organizationToDelete) return;

    try {
      await deleteOrganization(organizationToDelete.uuid);

      setOrganizationToDelete(null);

      fetchOrganizations({
        page: currentPage,
        perPage,
        search,
      });
    } catch {
      // El error ya se muestra desde el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setOrganizationToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Organizaciones"
        description="Administra las organizaciones registradas en el sistema."
        addLabel="Nueva organización"
        onAdd={() => router.push("/organizations/create")}
        searchValue={search}
        searchPlaceholder="Buscar organización..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <OrganizationTable
          data={organizations}
          loading={false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[10, 25, 50, 100]}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <ConfirmModal
        open={Boolean(organizationToDelete)}
        title="Eliminar organización"
        message={`¿Seguro que deseas eliminar la organización "${
          organizationToDelete?.name ?? ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}