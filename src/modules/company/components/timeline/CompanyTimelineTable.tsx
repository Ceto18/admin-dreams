// src/modules/company-timeline/components/CompanyTimelineTable.tsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import type { CompanyTimeline } from "../../types";

interface Props {
  data: CompanyTimeline[];
  loading?: boolean;

  onView?: (timeline: CompanyTimeline) => void;
  onEdit?: (timeline: CompanyTimeline) => void;
  onDelete?: (timeline: CompanyTimeline) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function CompanyTimelineTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props) {
  const router = useRouter();

  const handleView = (timeline: CompanyTimeline) => {
    if (onView) {
      onView(timeline);
      return;
    }

    router.push(`/company-timeline/${timeline.uuid}`);
  };

  const handleEdit = (timeline: CompanyTimeline) => {
    if (onEdit) {
      onEdit(timeline);
      return;
    }

    router.push(`/company-timeline/${timeline.uuid}/edit`);
  };

  const columns: DataTableColumn<CompanyTimeline>[] = [
    {
      key: "image_url",
      header: "Imagen",
      render: (timeline) => {
        const imageUrl = timeline.image_url ?? "";

        return imageUrl ? (
          <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={imageUrl}
              alt={timeline.title || "Imagen del acontecimiento"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-2 text-center text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900">
            Sin imagen
          </div>
        );
      },
    },
    {
      key: "title",
      header: "Acontecimiento",
      render: (timeline) => (
        <div className="max-w-sm">
          <p className="font-medium text-gray-800 dark:text-white/90">
            {timeline.title || "-"}
          </p>

          <p
            className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400"
            title={timeline.description}
          >
            {timeline.description || "Sin descripción"}
          </p>
        </div>
      ),
    },
    {
      key: "event_date",
      header: "Fecha",
      render: (timeline) => (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formatTimelineDate(timeline.event_date)}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {timeline.event_date || "-"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay acontecimientos registrados."
      getRowKey={(timeline) => timeline.uuid}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={onDelete}
      showView={false}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}

function formatTimelineDate(date?: string | null): string {
  if (!date) return "-";

  const normalizedDate =
    date.length === 10 ? `${date}T00:00:00` : date;

  const parsedDate = new Date(normalizedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}