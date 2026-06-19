"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import TableActions from "./TableActions";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
};

interface Props<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;

  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;

  getRowKey: (row: T, index: number) => string | number;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No hay datos registrados.",
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  getRowKey,
}: Props<T>) {
  const canView = showView && !!onView;
  const canEdit = showEdit && !!onEdit;
  const canDelete = showDelete && !!onDelete;

  const hasActions = canView || canEdit || canDelete;

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-end";
      default:
        return "text-start";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[780px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${getAlignClass(
                      column.align
                    )} ${column.className ?? ""}`}
                  >
                    {column.header}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                  >
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Cargando datos...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={getRowKey(row, rowIndex)}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400 ${getAlignClass(
                          column.align
                        )} ${column.className ?? ""}`}
                      >
                        {column.render(row, rowIndex)}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell className="px-5 py-4 text-end">
                        <TableActions
                          row={row}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          showView={showView}
                          showEdit={showEdit}
                          showDelete={showDelete}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}