// src/modules/company/components/SocialNetworkProfileTable.tsx

"use client";

import { useRouter } from "next/navigation";

import DataTable, {
  type DataTableColumn,
} from "@/shared/components/table/DataTable";

import type {
  SocialNetworkProfile,
} from "../../types";

interface Props {
  data: SocialNetworkProfile[];
  loading?: boolean;

  onView?: (
    profile: SocialNetworkProfile
  ) => void;

  onEdit?: (
    profile: SocialNetworkProfile
  ) => void;

  onDelete?: (
    profile: SocialNetworkProfile
  ) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function SocialNetworkProfileTable({
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

  const handleView = (
    profile: SocialNetworkProfile
  ) => {
    if (onView) {
      onView(profile);
      return;
    }

    router.push(
      `/social-network-profiles/${profile.uuid}`
    );
  };

  const handleEdit = (
    profile: SocialNetworkProfile
  ) => {
    if (onEdit) {
      onEdit(profile);
      return;
    }

    router.push(
      `/social-network-profiles/${profile.uuid}/edit`
    );
  };

  const columns: DataTableColumn<SocialNetworkProfile>[] =
    [
      {
        key: "social_network_name",
        header: "Red social",
        render: (profile) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {getSocialNetworkInitial(
                profile.social_network_name
              )}
            </div>

            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">
                {profile.social_network_name ||
                  "Sin red social"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Plataforma
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "nickname",
        header: "Nombre / Usuario",
        render: (profile) => (
          <div className="max-w-xs">
            <p className="font-medium text-gray-800 dark:text-white/90">
              {profile.nickname || "-"}
            </p>

            {profile.url ? (
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block max-w-xs truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
                title={profile.url}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {profile.url}
              </a>
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Sin enlace registrado
              </p>
            )}
          </div>
        ),
      },
      {
        key: "label",
        header: "Etiqueta",
        render: (profile) => (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {profile.label || "Sin etiqueta"}
          </span>
        ),
      },
    ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay perfiles de redes sociales registrados."
      getRowKey={(profile) => profile.uuid}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={onDelete}
      showView={showView}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}

function getSocialNetworkInitial(
  socialNetworkName?: string
): string {
  if (!socialNetworkName) {
    return "?";
  }

  return socialNetworkName
    .trim()
    .charAt(0)
    .toUpperCase();
}