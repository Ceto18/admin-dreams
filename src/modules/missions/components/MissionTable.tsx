"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "antd";
import Image from "next/image";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import { Mission } from "../types";

interface Props {
  data: Mission[];
  loading?: boolean;

  onView?: (mission: Mission) => void;
  onEdit?: (mission: Mission) => void;
  onDelete?: (mission: Mission) => void;
  onToggleState?: (mission: Mission, state: boolean) => Promise<void> | void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function MissionTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleState,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props) {
  const router = useRouter();

  const [updatingMissionUuid, setUpdatingMissionUuid] = useState<string | null>(
    null
  );

  const handleToggleState = async (mission: Mission, state: boolean) => {
    if (!onToggleState) return;

    try {
      setUpdatingMissionUuid(mission.uuid);

      await onToggleState(mission, state);
    } finally {
      setUpdatingMissionUuid(null);
    }
  };

  const handleView = (mission: Mission) => {
    if (onView) {
      onView(mission);
      return;
    }

    router.push(`/missions/${mission.uuid}/experiences`);
  };

  const handleEdit = (mission: Mission) => {
    if (onEdit) {
      onEdit(mission);
      return;
    }

    router.push(`/missions/${mission.uuid}/edit`);
  };

  const columns: DataTableColumn<Mission>[] = [
    {
      key: "image",
      header: "Imagen",
      render: (mission) => {
        const imageUrl = getMissionImageUrl(mission);

        return imageUrl ? (
          <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={imageUrl}
              alt={mission.name || "Imagen de misión"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900">
            Sin imagen
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Misión",
      render: (mission) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">
            {mission.name || "-"}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {mission.label || "Sin etiqueta"}
          </p>
        </div>
      ),
    },
    {
      key: "country",
      header: "País",
      render: (mission) => (
        <Badge size="sm" color="info">
          {mission.country || "-"}
        </Badge>
      ),
    },
    {
      key: "featured_on_home",
      header: "Home",
      render: (mission) => {
        const isFeatured = Boolean(Number(mission.featured_on_home ?? 0));

        return isFeatured ? (
          <div className="space-y-1">
            <Badge size="sm" color="success">
              Visible
            </Badge>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Orden {mission.home_order ?? "-"}
            </p>
          </div>
        ) : (
          <Badge size="sm" color="light">
            No visible
          </Badge>
        );
      },
    },
    {
      key: "active",
      header: "Habilitado",
      render: (mission) => (
        <Switch
          checked={Boolean(mission.active)}
          loading={updatingMissionUuid === mission.uuid}
          disabled={
            !onToggleState ||
            (updatingMissionUuid !== null &&
              updatingMissionUuid !== mission.uuid)
          }
          onChange={(checked) => handleToggleState(mission, checked)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay misiones registradas."
      getRowKey={(mission) => mission.uuid}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={onDelete}
      showView={showView}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}

function getMissionImageUrl(mission: Mission) {
  if (typeof mission.image === "string") {
    return mission.image;
  }

  if (mission.image?.image_url) {
    return mission.image.image_url;
  }

  if (mission.image_url) {
    return mission.image_url;
  }

  return "";
}