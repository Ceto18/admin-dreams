// src/app/(admin)/cards/create/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CardForm from "@/modules/cards/components/CardForm";
import { useCardStore } from "@/modules/cards/store/useCardStore";
import { CardFormValues } from "@/modules/cards/types";
import { organizationService } from "@/modules/organizations/services/organizationService";
import { handleApiError } from "@/shared/utils/handleApiError";

type Organization = {
    uuid: string;
    name?: string;
};

export default function CreateCardPage() {
    const router = useRouter();

    const { createCard, saving } = useCardStore();

    const [organizationUuid, setOrganizationUuid] = useState("");
    const [loadingOrganization, setLoadingOrganization] = useState(true);

    useEffect(() => {
        const loadOrganization = async () => {
            try {
                setLoadingOrganization(true);

                const response = await organizationService.getOrganizations({
                    page: 1,
                    per_page: 1,
                });

                const organization: Organization | null =
                    response.data?.data?.[0] ??
                    response.data?.[0] ??
                    response.data ??
                    null;

                if (organization?.uuid) {
                    setOrganizationUuid(organization.uuid);
                }
            } catch (error) {
                console.error("Error al cargar organización:", error);
                handleApiError(error);
            } finally {
                setLoadingOrganization(false);
            }
        };

        loadOrganization();
    }, []);

    const handleSubmit = async (values: CardFormValues) => {
        try {
            if (!organizationUuid) {
                throw new Error("No se encontró el UUID de la organización.");
            }

            await createCard(organizationUuid, values);

            router.push("/cards");
        } catch (error) {
            console.error("Error al crear tarjeta:", error);
        }
    };

    if (loadingOrganization) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400">
                Cargando organización...
            </div>
        );
    }

    if (!organizationUuid) {
        return (
            <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-sm text-error-600 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400">
                No se encontró una organización disponible para crear la tarjeta.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Nueva tarjeta
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Crea una tarjeta de presentación digital y selecciona una plantilla.
                </p>
            </div>

            <CardForm loading={saving} onSubmit={handleSubmit} />
        </div>
    );
}