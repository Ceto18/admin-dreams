// src/app/(admin)/reviews/[uuid]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";

import ReviewForm from "@/modules/reviews/components/form/ReviewForm";
import { useReviewStore } from "@/modules/reviews/store/useReviewStore";

import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import type { UpdateReviewPayload } from "@/modules/reviews/types";

function PageLoading() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
                <Spin size="large" />

                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Cargando reseña...
                </span>
            </div>
        </div>
    );
}

export default function ReviewEditPage() {
    const router = useRouter();
    const params = useParams();

    const uuid = String(params.uuid ?? "");

    const {
        selectedReview,
        loadingDetail,
        updating,
        deletingVideo,
        fetchReview,
        updateReview,
        deleteReviewVideo,
        clearSelectedReview,
    } = useReviewStore();

    const [reviewToDeleteVideoUuid, setReviewToDeleteVideoUuid] =
        useState<string | null>(null);

    useEffect(() => {
        if (!uuid) return;

        fetchReview(uuid);

        return () => {
            clearSelectedReview();
        };
    }, [uuid, fetchReview, clearSelectedReview]);

    const handleSubmit = async (
        payload: UpdateReviewPayload
    ) => {
        if (!uuid) return;

        try {
            await updateReview(uuid, payload);

            router.push("/reviews");
        } catch (error) {
            console.error(
                "Error handleSubmit:",
                error
            );
        }
    };

    const handleDeleteVideo = () => {
        if (!uuid || !selectedReview?.video_url) {
            return;
        }

        setReviewToDeleteVideoUuid(uuid);
    };

    const handleConfirmDeleteVideo =
        async () => {
            if (!reviewToDeleteVideoUuid) {
                return;
            }

            const reviewUuid =
                reviewToDeleteVideoUuid;

            setReviewToDeleteVideoUuid(null);

            try {
                await deleteReviewVideo(
                    reviewUuid
                );

                await fetchReview(reviewUuid);
            } catch (error) {
                console.error(
                    "Error handleConfirmDeleteVideo:",
                    error
                );
            }
        };

    const handleCancelDeleteVideo = () => {
        if (deletingVideo) return;

        setReviewToDeleteVideoUuid(null);
    };

    const handleBack = () => {
        if (
            loadingDetail ||
            updating ||
            deletingVideo
        ) {
            return;
        }

        router.push("/reviews");
    };

    if (
        loadingDetail &&
        !selectedReview
    ) {
        return <PageLoading />;
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

                <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-brand-300/10 blur-3xl" />

                <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                            Reseñas
                        </span>

                        <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
                            Editar reseña
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Actualiza el comentario, la calificación y
                            el estado de la reseña seleccionada.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={
                            loadingDetail ||
                            updating ||
                            deletingVideo
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        Volver
                    </button>
                </div>
            </div>

            {selectedReview ? (
                <ReviewForm
                    initialData={selectedReview}
                    loading={updating}
                    deletingVideo={deletingVideo}
                    onSubmit={handleSubmit}
                    onDeleteVideo={handleDeleteVideo}
                />
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No se pudo obtener la información de la
                        reseña.
                    </p>
                </div>
            )}

            <ConfirmModal
                open={Boolean(
                    reviewToDeleteVideoUuid
                )}
                title="Eliminar video"
                message="¿Seguro que deseas eliminar el video asociado a esta reseña? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                loading={deletingVideo}
                onConfirm={
                    handleConfirmDeleteVideo
                }
                onCancel={
                    handleCancelDeleteVideo
                }
            />
        </div>
    );
}