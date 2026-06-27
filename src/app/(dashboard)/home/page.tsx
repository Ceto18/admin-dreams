"use client";

import { useEffect, useState } from "react";

import HomeForm from "@/modules/home/components/form/HomeForm";
import { useHomeStore } from "@/modules/home/store/useHomeStore";
import { HomePayload } from "@/modules/home/types";

import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

export default function HomePage() {
    const {
        home,
        loading,
        deletingHeroImageUuid,
        fetchHome,
        updateHome,
        deleteHeroImage,
    } = useHomeStore();

    const [imageToDeleteUuid, setImageToDeleteUuid] = useState<string | null>(
        null
    );

    useEffect(() => {
        fetchHome();
    }, [fetchHome]);

    const handleSubmit = async (payload: HomePayload) => {
        await updateHome(payload);

        await fetchHome();
    };

    const handleDeleteExistingImage = (imageUuid: string) => {
        setImageToDeleteUuid(imageUuid);
    };

    const handleConfirmDeleteImage = async () => {
        if (!imageToDeleteUuid) return;

        const imageUuid = imageToDeleteUuid;

        setImageToDeleteUuid(null);

        try {
            await deleteHeroImage(imageUuid);

            await fetchHome();
        } catch (error) {
            console.error("Error handleConfirmDeleteImage:", error);
        }
    };
    
    const handleCancelDeleteImage = () => {
        if (deletingHeroImageUuid) return;

        setImageToDeleteUuid(null);
    };

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-brand-300/10 blur-3xl" />

                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                        Dreams Admin
                    </span>

                    <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
                        Gestión del Home
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Actualiza el contenido principal de la landing:
                        título, texto destacado, descripción, contadores e
                        imágenes del hero.
                    </p>
                </div>
            </div>

            <HomeForm
                initialData={home}
                loading={loading}
                deletingImageUuid={deletingHeroImageUuid}
                onSubmit={handleSubmit}
                onDeleteExistingImage={handleDeleteExistingImage}
            />

            <ConfirmModal
                open={Boolean(imageToDeleteUuid)}
                title="Eliminar imagen"
                message="¿Seguro que deseas eliminar esta imagen del hero? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                loading={Boolean(deletingHeroImageUuid)}
                onConfirm={handleConfirmDeleteImage}
                onCancel={handleCancelDeleteImage}
            />
        </div>
    );
}