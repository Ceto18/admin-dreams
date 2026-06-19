"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  perPage,
  perPageOptions = [10, 20, 50, 100],
  onPageChange,
  onPerPageChange,
}: Props) {
  const safeTotalPages = Math.max(totalPages, 1);

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1)
    .filter((page) => {
      if (safeTotalPages <= 5) return true;

      return (
        page === 1 ||
        page === safeTotalPages ||
        Math.abs(page - currentPage) <= 1
      );
    });

  return (
    <div className="flex flex-col gap-4 rounded-b-xl border-t border-gray-100 bg-white px-5 py-4 dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Mostrar
        </span>

        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="h-9 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          registros
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            const previousPage = pages[index - 1];
            const showDots = previousPage && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center gap-1">
                {showDots && (
                  <span className="px-2 text-sm text-gray-400">...</span>
                )}

                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-brand-500 text-white"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {page}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= safeTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.05]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}