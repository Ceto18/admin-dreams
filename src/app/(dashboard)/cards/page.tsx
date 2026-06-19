// src/app/(admin)/cards/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import CardTable from "@/modules/cards/components/CardTable";
import { useCardStore } from "@/modules/cards/store/useCardStore";
import { Card } from "@/modules/cards/types";
import { organizationService } from "@/modules/organizations/services/organizationService";
import { cardService } from "@/modules/cards/services/cardService";
import { handleApiError } from "@/shared/utils/handleApiError";

type Organization = {
  uuid: string;
  name?: string;
};

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando tarjetas...
        </span>
      </div>
    </div>
  );
}

function CardsPageErrorMessage({ message }: { message: string }) {
  return (
    <Alert
      message={message}
      type="error"
      showIcon
      className="
        rounded-xl
        border-error-200
        bg-error-50
        text-error-600
        shadow-none
        dark:border-error-500/20
        dark:bg-error-500/10
        dark:text-error-400
        [&_.ant-alert-message]:text-error-600
        dark:[&_.ant-alert-message]:text-error-400
      "
    />
  );
}

export default function CardsPage() {
  const router = useRouter();

  const {
    cards,
    currentPage,
    totalPages,
    perPage,
    loading,
    fetchCards,
    deleteCard,
  } = useCardStore();

  const [search, setSearch] = useState("");
  const [organizationUuid, setOrganizationUuid] = useState("");
  const [organizationLoaded, setOrganizationLoaded] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        setOrganizationLoaded(false);

        const response = await organizationService.getOrganizations({
          page: 1,
          per_page: 1,
        });

        const organization: Organization | null =
          response.data?.data?.[0] ??
          response.data?.[0] ??
          response.data ??
          null;

        if (!organization?.uuid) return;

        setOrganizationUuid(organization.uuid);

        await fetchCards(organization.uuid, {
          page: 1,
          perPage,
          search: "",
        });
      } catch (error) {
        console.error("Error al cargar organización:", error);
        handleApiError(error);
      } finally {
        setOrganizationLoaded(true);
      }
    };

    loadOrganization();
  }, [fetchCards, perPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleToggleState = async (card: Card, state: boolean) => {
    try {
      if (!organizationUuid) return;

      await cardService.toggleCardState(organizationUuid, card.uuid, state);

      await fetchCards(organizationUuid, {
        page: currentPage,
        perPage,
        search,
      });
    } catch (error) {
      console.error("Error al cambiar estado de la tarjeta:", error);
      handleApiError(error);
    }
  };

  const handleSearchSubmit = () => {
    if (!organizationUuid) return;

    fetchCards(organizationUuid, {
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    if (!organizationUuid) return;

    fetchCards(organizationUuid, {
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (!organizationUuid) return;

    fetchCards(organizationUuid, {
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleView = (card: Card) => {
    router.push(`/cards/${card.uuid}`);
  };

  const handleEdit = (card: Card) => {
    router.push(`/cards/${card.uuid}/edit`);
  };

  const handleDelete = (card: Card) => {
    setCardToDelete(card);
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete || !organizationUuid) return;

    try {
      await deleteCard(organizationUuid, cardToDelete.uuid);

      setCardToDelete(null);

      await fetchCards(organizationUuid, {
        page: currentPage,
        perPage,
        search,
      });
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setCardToDelete(null);
  };

  if (organizationLoaded && !organizationUuid) {
    return (
      <CardsPageErrorMessage message="No se encontró una organización disponible para listar las tarjetas." />
    );
  }

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Tarjetas"
        description="Administra las tarjetas de presentación digitales."
        addLabel="Nueva tarjeta"
        onAdd={() => router.push("/cards/create")}
        searchValue={search}
        searchPlaceholder="Buscar tarjeta..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {(!organizationLoaded || loading) && <TableAntLoading />}

        <CardTable
          data={cards}
          loading={false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleState={handleToggleState}
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[10, 25, 50, 100]}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <ConfirmModal
        open={Boolean(cardToDelete)}
        title="Eliminar tarjeta"
        message={`¿Seguro que deseas eliminar la tarjeta "${
          cardToDelete?.full_name ?? ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}