"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";

import MissionForm from "@/modules/missions/components/form/MissionForm";
import { useMissionStore } from "@/modules/missions/store/useMissionStore";
import { MissionPayload } from "@/modules/missions/types";

function PageLoading() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
                <Spin size="large" />

                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Cargando misión...
                </span>
            </div>
        </div>
    );
}

export default function MissionEditPage() {
    const router = useRouter();
    const params = useParams();

    const uuid = String(params.uuid ?? "");

    const { mission, loading, fetchMission, updateMission, clearMission } =
        useMissionStore();

    useEffect(() => {
        if (!uuid) return;

        fetchMission(uuid);

        return () => {
            clearMission();
        };
    }, [uuid, fetchMission, clearMission]);

    const handleSubmit = async (payload: MissionPayload) => {
        if (!uuid) return;

        try {
            await updateMission(uuid, payload);

            router.push("/missions");
        } catch {
            // El error ya se maneja en el store.
        }
    };

    const handleBack = () => {
        if (loading) return;

        router.push("/missions");
    };

    if (loading && !mission) {
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
                            Misiones
                        </span>

                        <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
                            Editar misión
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Actualiza la información de la misión, su imagen y su visibilidad
                            destacada en el home de la landing.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        Volver
                    </button>
                </div>
            </div>

            <MissionForm
                initialData={mission}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
}