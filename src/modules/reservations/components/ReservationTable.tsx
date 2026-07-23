// src/modules/reservations/components/ReservationTable.tsx

"use client";

import { useRouter } from "next/navigation";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import type {
  ReservationListItem,
  ReservationStatus,
} from "../types";

interface Props {
  data: ReservationListItem[];
  loading?: boolean;

  onView?: (
    reservation: ReservationListItem
  ) => void;

  showView?: boolean;
}

export default function ReservationTable({
  data,
  loading = false,
  onView,
  showView = true,
}: Props) {
  const router = useRouter();

  const handleView = (
    reservation: ReservationListItem
  ) => {
    if (onView) {
      onView(reservation);
      return;
    }

    router.push(
      `/reservations/${encodeURIComponent(
        reservation.reservation_code
      )}`
    );
  };

  const columns: DataTableColumn<ReservationListItem>[] =
    [
      {
        key: "reservation_code",
        header: "Código",
        render: (reservation) => (
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {reservation.reservation_code ||
                "-"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reservación
            </p>
          </div>
        ),
      },
      {
        key: "full_name",
        header: "Cliente",
        render: (reservation) => (
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {reservation.full_name || "-"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Titular de la reservación
            </p>
          </div>
        ),
      },
      {
        key: "experience_name",
        header: "Experiencia",
        render: (reservation) => (
          <div className="max-w-xs">
            <p className="truncate font-medium text-gray-800 dark:text-white/90">
              {reservation.experience_name ||
                "-"}
            </p>
          </div>
        ),
      },
      {
        key: "passengers",
        header: "Pasajeros",
        render: (reservation) => (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {reservation.passengers ??
              "Sin registrar"}
          </p>
        ),
      },
      {
        key: "status",
        header: "Estado",
        render: (reservation) => (
          <ReservationStatusBadge
            status={reservation.status}
          />
        ),
      },
    ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay reservaciones registradas."
      getRowKey={(reservation) =>
        reservation.reservation_code
      }
      onView={handleView}
      showView={showView}
      showEdit={false}
      showDelete={false}
    />
  );
}

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
}

function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  switch (status) {
    case "confirmed":
      return (
        <Badge size="sm" color="success">
          Confirmada
        </Badge>
      );

    case "cancelled":
      return (
        <Badge size="sm" color="error">
          Cancelada
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