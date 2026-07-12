// src/modules/reviews/components/ReviewTable.tsx

"use client";

import { useRouter } from "next/navigation";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import type { Review } from "../types";

interface Props {
  data: Review[];
  loading?: boolean;

  onView?: (review: Review) => void;

  showView?: boolean;
}

export default function ReviewTable({
  data,
  loading = false,
  onView,
  showView = true,
}: Props) {
  const router = useRouter();

  const handleView = (review: Review) => {
    if (onView) {
      onView(review);
      return;
    }

    router.push(`/reviews/${review.uuid}`);
  };

  const columns: DataTableColumn<Review>[] = [
    {
      key: "name",
      header: "Persona",
      render: (review) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">
            {review.name || "-"}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reseña
          </p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Calificación",
      render: (review) => (
        <div className="flex items-center gap-2">
          <Badge size="sm" color="warning">
            ⭐ {review.rating ?? 0}/5
          </Badge>
        </div>
      ),
    },
    {
      key: "is_approved",
      header: "Estado",
      render: (review) =>
        review.is_approved ? (
          <Badge size="sm" color="success">
            Aprobada
          </Badge>
        ) : (
          <Badge size="sm" color="warning">
            Pendiente
          </Badge>
        ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay reseñas registradas."
      getRowKey={(review) => review.uuid}
      onView={handleView}
      showView={showView}
      showEdit={false}
      showDelete={false}
    />
  );
}