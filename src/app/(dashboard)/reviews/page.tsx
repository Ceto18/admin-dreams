// src/app/(admin)/reviews/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";

import ReviewTable from "@/modules/reviews/components/ReviewTable";
import { useReviewStore } from "@/modules/reviews/store/useReviewStore";

import type { Review } from "@/modules/reviews/types";

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

function ReviewDetailLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando detalle de la reseña...
        </span>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const {
    reviews,
    selectedReview,

    loading,
    loadingDetail,

    currentPage,
    totalPages,
    perPage,

    fetchReviews,
    fetchReview,

    clearSelectedReview,
  } = useReviewStore();

  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState(false);

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

  const handleView = async (review: Review) => {
    setShowDetail(true);

    await fetchReview(review.uuid);
  };

  const handleCloseDetail = () => {
    if (loadingDetail) return;

    clearSelectedReview();
    setShowDetail(false);
  };

  return (
    <div className="space-y-6">
      {!showDetail && (
        <TableToolbar
          title="Reseñas"
          description="Consulta las reseñas registradas, sus calificaciones y estado de aprobación."
          searchValue={search}
          searchPlaceholder="Buscar reseña..."
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      )}

      {showDetail ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Detalle de la reseña
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Consulta la información completa de la reseña seleccionada.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseDetail}
              disabled={loadingDetail}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Volver a la tabla
            </button>
          </div>

          {loadingDetail ? (
            <ReviewDetailLoading />
          ) : selectedReview ? (
            <ReviewDetail review={selectedReview} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No se pudo obtener la información de la reseña.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="relative">
            {loading && <TableAntLoading />}

            <ReviewTable
              data={reviews}
              loading={false}
              onView={handleView}
              showView
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
        </>
      )}
    </div>
  );
}

interface ReviewDetailProps {
  review: Review;
}

function ReviewDetail({ review }: ReviewDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          label="Nombre"
          value={review.name || "-"}
        />

        <DetailItem
          label="Calificación"
          value={`${review.rating ?? 0}/5`}
        />

        <DetailItem
          label="Estado"
          value={review.is_approved ? "Aprobada" : "Pendiente"}
        />

        <DetailItem
          label="Misión"
          value={review.mission_name || "-"}
        />

        <DetailItem
          label="Experiencia"
          value={review.experience_name || "-"}
        />

        <DetailItem
          label="Momento"
          value={review.moment_name || "-"}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Comentario
        </h3>

        <div className="min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {review.comment || "Sin comentario registrado."}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Video
        </h3>

        {review.video_url ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-800">
            <video
              src={review.video_url}
              controls
              className="max-h-[520px] w-full"
            >
              Tu navegador no puede reproducir este video.
            </video>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esta reseña no tiene un video asociado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}