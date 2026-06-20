"use client";

import Image from "next/image";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import { MissionExperience } from "../types";

interface Props {
  data: MissionExperience[];
  loading?: boolean;

  onView?: (experience: MissionExperience) => void;
  onEdit?: (experience: MissionExperience) => void;
  onDelete?: (experience: MissionExperience) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function MissionExperienceTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props) {
  const columns: DataTableColumn<MissionExperience>[] = [
    {
      key: "name",
      header: "Experiencia",
      render: (experience) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">
            {experience.name || "-"}
          </p>

          <p className="max-w-[280px] truncate text-xs text-gray-500 dark:text-gray-400">
            {experience.short_description || "Sin descripción corta"}
          </p>
        </div>
      ),
    },
    {
      key: "release_date",
      header: "Fecha",
      render: (experience) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatDate(experience.release_date)}
        </span>
      ),
    },
    {
      key: "seats",
      header: "Cupos",
      render: (experience) => (
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {experience.seats_used ?? 0}/{experience.number_seats ?? 0}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            usados / total
          </p>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duración",
      render: (experience) => (
        <Badge size="sm" color="info">
          {experience.days ?? 0}D / {experience.nights ?? 0}N
        </Badge>
      ),
    },
    {
      key: "raiting",
      header: "Rating",
      render: (experience) => (
        <Badge size="sm" color="warning">
          ⭐ {experience.raiting ?? "-"}
        </Badge>
      ),
    },
    {
      key: "investment",
      header: "Inversión",
      render: (experience) => (
        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
          {formatMoney(experience.investment)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay experiencias registradas."
      getRowKey={(experience) => experience.uuid}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      showView={showView}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}

function getExperienceImageUrl(experience: MissionExperience) {
  const firstImage = experience.images?.[0];

  if (firstImage?.image_url) {
    return firstImage.image_url;
  }

  return "";
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value?: string | number) {
  if (value === undefined || value === null || value === "") return "-";

  return `S/ ${Number(value).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}