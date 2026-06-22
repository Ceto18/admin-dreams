"use client";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import { MissionMoment } from "../types";

interface Props {
  data: MissionMoment[];
  loading?: boolean;

  onView?: (moment: MissionMoment) => void;
  onEdit?: (moment: MissionMoment) => void;
  onDelete?: (moment: MissionMoment) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function MissionMomentTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  showView = false,
  showEdit = true,
  showDelete = true,
}: Props) {
  const columns: DataTableColumn<MissionMoment>[] = [
    {
      key: "title",
      header: "Momento",
      render: (moment) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">
            {moment.title || "-"}
          </p>

          <p className="max-w-[320px] truncate text-xs text-gray-500 dark:text-gray-400">
            {moment.description || "Sin descripción"}
          </p>
        </div>
      ),
    },
    {
      key: "place",
      header: "Lugar",
      render: (moment) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {moment.place || "-"}
        </span>
      ),
    },
    {
      key: "experience",
      header: "Experiencia",
      render: (moment) => (
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {moment.experience || "-"}
          </p>

          <p className="max-w-[220px] truncate text-xs text-gray-500 dark:text-gray-400">
            {moment.mission_experience?.name || "Sin experiencia asociada"}
          </p>
        </div>
      ),
    },
    {
      key: "ideal",
      header: "Ideal",
      render: (moment) => (
        <Badge size="sm" color="info">
          {moment.ideal || "-"}
        </Badge>
      ),
    },
    {
      key: "sensation",
      header: "Sensación",
      render: (moment) => (
        <Badge size="sm" color="warning">
          {moment.sensation || "-"}
        </Badge>
      ),
    },
    {
      key: "images",
      header: "Imágenes",
      render: (moment) => (
        <div className="flex items-center gap-2">
          {moment.images?.slice(0, 3).map((image) => (
            <div
              key={image.uuid}
              className="h-9 w-9 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
            >
              {image.image_url ? (
                <img
                  src={image.image_url}
                  alt={image.name || moment.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  -
                </div>
              )}
            </div>
          ))}

          {moment.images?.length > 3 && (
            <Badge size="sm" color="light">
              +{moment.images.length - 3}
            </Badge>
          )}

          {(!moment.images || moment.images.length === 0) && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Sin imágenes
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay momentos registrados."
      getRowKey={(moment) => moment.uuid}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      showView={showView}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}