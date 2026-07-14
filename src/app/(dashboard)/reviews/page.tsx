// src/app/(admin)/reviews/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";

import ReviewTable from "@/modules/reviews/components/ReviewTable";
import { useReviewStore } from "@/modules/reviews/store/useReviewStore";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando reseñas...
        </span>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const {
    reviews,
    loading,

    currentPage,
    totalPages,
    perPage,

    fetchReviews,
  } = useReviewStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReviews({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchReviews]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchReviews({
      page: 1,
      perPage,
      search: search.trim(),
    });
  };

  const handlePageChange = (page: number) => {
    fetchReviews({
      page,
      perPage,
      search: search.trim(),
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    fetchReviews({
      page: 1,
      perPage: newPerPage,
      search: search.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Reseñas"
        description="Consulta y administra las reseñas registradas, sus calificaciones y estados."
        searchValue={search}
        searchPlaceholder="Buscar reseña..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <ReviewTable
          data={reviews}
          loading={false}
          showEdit
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
    </div>
  );
}