// src/modules/reviews/components/ReviewTable.tsx

"use client";

import { useRouter } from "next/navigation";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import type {
  Review,
  ReviewState,
} from "../types";

interface Props {
  data: Review[];
  loading?: boolean;

  onEdit?: (review: Review) => void;

  showEdit?: boolean;
}

export default function ReviewTable({
  data,
  loading = false,
  onEdit,
  showEdit = true,
}: Props) {
  const router = useRouter();

  const handleEdit = (review: Review) => {
    if (onEdit) {
      onEdit(review);
      return;
    }

    router.push(`/reviews/${review.uuid}/edit`);
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
      key: "state",
      header: "Estado",
      render: (review) => (
        <ReviewStateBadge
          state={getReviewState(review)}
        />
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
      onEdit={handleEdit}
      showView={false}
      showEdit={showEdit}
      showDelete={false}
    />
  );
}

interface ReviewStateBadgeProps {
  state: ReviewState;
}

function ReviewStateBadge({
  state,
}: ReviewStateBadgeProps) {
  switch (state) {
    case "approved":
      return (
        <Badge size="sm" color="success">
          Aprobada
        </Badge>
      );

    case "denied":
      return (
        <Badge size="sm" color="error">
          Denegada
        </Badge>
      );

    case "pending":
    default:
      return (
        <Badge size="sm" color="warning">
          Pendiente
        </Badge>
      );
  }
}

function getReviewState(
  review: Review
): ReviewState {
  if (review.state) {
    return review.state;
  }

  return review.is_approved
    ? "approved"
    : "pending";
}