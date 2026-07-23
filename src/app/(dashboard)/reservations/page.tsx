// src/app/(admin)/reservations/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";

import ReservationTable from "@/modules/reservations/components/ReservationTable";
import { useReservationStore } from "@/modules/reservations/store/useReservationStore";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando reservaciones...
        </span>
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const {
    reservations,
    loading,

    currentPage,
    totalPages,
    perPage,

    fetchReservations,
  } = useReservationStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReservations({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchReservations]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchReservations({
      page: 1,
      perPage,
      search: search.trim(),
    });
  };

  const handlePageChange = (page: number) => {
    fetchReservations({
      page,
      perPage,
      search: search.trim(),
    });
  };

  const handlePerPageChange = (
    newPerPage: number
  ) => {
    fetchReservations({
      page: 1,
      perPage: newPerPage,
      search: search.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Reservaciones"
        description="Consulta las reservaciones registradas, sus clientes, experiencias y estados."
        searchValue={search}
        searchPlaceholder="Buscar reservación..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <ReservationTable
          data={reservations}
          loading={false}
          showView
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[15, 25, 50, 100]}
        onPageChange={handlePageChange}
        onPerPageChange={
          handlePerPageChange
        }
      />
    </div>
  );
}
