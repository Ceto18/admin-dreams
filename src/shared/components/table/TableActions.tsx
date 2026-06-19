"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface Props<T> {
  row: T;

  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function TableActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props<T>) {
  const canView = showView && !!onView;
  const canEdit = showEdit && !!onEdit;
  const canDelete = showDelete && !!onDelete;

  if (!canView && !canEdit && !canDelete) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {canView && (
        <button
          type="button"
          onClick={() => onView(row)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 dark:border-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
          title="Ver"
        >
          <Eye size={17} />
        </button>
      )}

      {canEdit && (
        <button
          type="button"
          onClick={() => onEdit(row)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 text-amber-600 transition hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
          title="Editar"
        >
          <Pencil size={17} />
        </button>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(row)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
          title="Eliminar"
        >
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}