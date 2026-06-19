"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import DiscountCodeTable from "@/modules/discountCodes/components/DiscountCodeTable";
import { useDiscountCodeStore } from "@/modules/discountCodes/store/useDiscountCodeStore";
import { DiscountCode } from "@/modules/discountCodes/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando códigos de descuento...
        </span>
      </div>
    </div>
  );
}

export default function DiscountCodesPage() {
  const router = useRouter();

  const {
    discountCodes,
    currentPage,
    totalPages,
    perPage,
    loading,
    fetchDiscountCodes,
    deleteDiscountCode,
  } = useDiscountCodeStore();

  const [search, setSearch] = useState("");
  const [discountCodeToDelete, setDiscountCodeToDelete] =
    useState<DiscountCode | null>(null);

  useEffect(() => {
    fetchDiscountCodes({
      page: 1,
      perPage,
      search: "",
    });
  }, [fetchDiscountCodes, perPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchDiscountCodes({
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    fetchDiscountCodes({
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    fetchDiscountCodes({
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleView = (discountCode: DiscountCode) => {
    router.push(`/discount-codes/${discountCode.uuid}`);
  };

  const handleEdit = (discountCode: DiscountCode) => {
    router.push(`/discount-codes/${discountCode.uuid}/edit`);
  };

  const handleDelete = (discountCode: DiscountCode) => {
    setDiscountCodeToDelete(discountCode);
  };

  const handleConfirmDelete = async () => {
    if (!discountCodeToDelete) return;

    try {
      await deleteDiscountCode(discountCodeToDelete.uuid);

      setDiscountCodeToDelete(null);

      await fetchDiscountCodes({
        page: currentPage,
        perPage,
        search,
      });
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setDiscountCodeToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Códigos de descuento"
        description="Administra los códigos promocionales disponibles."
        addLabel="Nuevo código"
        onAdd={() => router.push("/discount-codes/create")}
        searchValue={search}
        searchPlaceholder="Buscar código..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <DiscountCodeTable
          data={discountCodes}
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
        open={Boolean(discountCodeToDelete)}
        title="Eliminar código de descuento"
        message={`¿Seguro que deseas eliminar el código "${
          discountCodeToDelete?.code ?? ""
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