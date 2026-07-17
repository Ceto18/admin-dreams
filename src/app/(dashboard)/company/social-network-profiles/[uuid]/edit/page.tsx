"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";


import { useSocialNetworkProfileStore } from "@/modules/company/store/useSocialNetworkProfileStore";

import type {
    SocialNetworkProfilePayload,
} from "@/modules/company/types";
import SocialNetworkProfileForm from "@/modules/company/components/social-network-profiles/form/SocialNetworkProfileForm";

function PageLoading() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
                <Spin size="large" />

                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Cargando perfil social...
                </span>
            </div>
        </div>
    );
}

export default function SocialNetworkProfileEditPage() {
    const router = useRouter();
    const params = useParams();

    const uuid = String(params.uuid ?? "");

    const {
        profile,
        socialNetworks,
        loading,
        loadingSocialNetworks,
        fetchProfile,
        fetchSocialNetworks,
        updateProfile,
        clearProfile,
    } = useSocialNetworkProfileStore();

    useEffect(() => {
        if (!uuid) return;

        void fetchProfile(uuid);
        void fetchSocialNetworks();

        return () => {
            clearProfile();
        };
    }, [
        uuid,
        fetchProfile,
        fetchSocialNetworks,
        clearProfile,
    ]);

    const handleSubmit = async (
        payload: SocialNetworkProfilePayload
    ) => {
        if (!uuid) return;

        try {
            await updateProfile(uuid, payload);

            router.push(
                "/company/social-network-profiles"
            );
        } catch {
            // El error ya se maneja en el store.
        }
    };

    const handleBack = () => {
        if (
            loading ||
            loadingSocialNetworks
        ) {
            return;
        }

        router.push(
            "/company/social-network-profiles"
        );
    };

    if (
        (loading && !profile) ||
        (loadingSocialNetworks &&
            socialNetworks.length === 0)
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
                            Redes sociales
                        </span>

                        <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
                            Editar perfil social
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Actualiza la red social, el nombre,
                            la dirección del perfil y la etiqueta
                            asociada.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={
                            loading ||
                            loadingSocialNetworks
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    >
                        Volver
                    </button>
                </div>
            </div>

            {profile ? (
                <SocialNetworkProfileForm
                    initialData={profile}
                    socialNetworks={socialNetworks}
                    loading={loading}
                    loadingSocialNetworks={
                        loadingSocialNetworks
                    }
                    onSubmit={handleSubmit}
                />
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No se pudo encontrar el perfil social
                        solicitado.
                    </p>
                </div>
            )}
        </div>
    );
}