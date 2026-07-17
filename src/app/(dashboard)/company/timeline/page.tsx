// src/app/(admin)/company-timeline/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import CompanyTimelineTable from "@/modules/company/components/timeline/CompanyTimelineTable";

import { useCompanyTimelineStore } from "@/modules/company/store/useCompanyTimelineStore";

import type { CompanyTimeline } from "@/modules/company/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando acontecimientos...
        </span>
      </div>
    </div>
  );
}

export default function CompanyTimelinePage() {
  const router = useRouter();

  const {
    timelines,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchTimelines,
    deleteTimeline,
  } = useCompanyTimelineStore();

  const [search, setSearch] = useState("");

  const [timelineToDelete, setTimelineToDelete] =
    useState<CompanyTimeline | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTimelines({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchTimelines]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchTimelines({
      page: 1,
      perPage,
      search: search.trim(),
    });
  };

  const handlePageChange = (page: number) => {
    fetchTimelines({
      page,
      perPage,
      search: search.trim(),
    });
  };

  const handlePerPageChange = (
    newPerPage: number
  ) => {
    fetchTimelines({
      page: 1,
      perPage: newPerPage,
      search: search.trim(),
    });
  };

  const handleView = (
    timeline: CompanyTimeline
  ) => {
    router.push(
      `/company/${timeline.uuid}`
    );
  };

  const handleOpenCreate = () => {
    router.push("/company/timeline/create");
  };

  const handleOpenEdit = (
    timeline: CompanyTimeline
  ) => {
    router.push(
      `/company/timeline/${timeline.uuid}/edit`
    );
  };

  const handleDelete = (
    timeline: CompanyTimeline
  ) => {
    setTimelineToDelete(timeline);
  };

  const handleConfirmDelete = async () => {
    if (!timelineToDelete) return;

    try {
      await deleteTimeline(
        timelineToDelete.uuid
      );

      setTimelineToDelete(null);

      const shouldGoToPreviousPage =
        timelines.length === 1 &&
        currentPage > 1;

      await fetchTimelines({
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

    setTimelineToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Línea de tiempo"
        description="Administra los acontecimientos de la historia de la empresa."
        addLabel="Nuevo acontecimiento"
        onAdd={handleOpenCreate}
        searchValue={search}
        searchPlaceholder="Buscar acontecimiento..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <CompanyTimelineTable
          data={timelines}
          loading={false}
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          showView
          showEdit
          showDelete
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[10, 25, 50, 100]}
        onPageChange={handlePageChange}
        onPerPageChange={
          handlePerPageChange
        }
      />

      <ConfirmModal
        open={Boolean(timelineToDelete)}
        title="Eliminar acontecimiento"
        message={`¿Seguro que deseas eliminar el acontecimiento "${
          timelineToDelete?.title ?? ""
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