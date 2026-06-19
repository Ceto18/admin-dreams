"use client";

import Input from "@/shared/components/form/input/InputField";
import Label from "@/shared/components/form/Label";
import Button from "@/shared/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/shared/icons";
import Link from "next/link";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { loginRequest } from "../services/authService";
import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

export default function SignInForm() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        if (!email.trim() || !password.trim()) {
            handleApiError({
                response: {
                    data: {
                        message: "Ingresa tu correo y contraseña.",
                    },
                },
            });

            return;
        }

        setLoading(true);

        try {
            const response = await loginRequest({
                email,
                password,
            });

            const user = response?.user;
            const token = response?.token;

            if (!token || !user) {
                throw new Error("Respuesta inválida del backend");
            }

            setAuth({
                user,
                token,
            });

            showSuccess("Inicio de sesión correcto.");

            router.replace("/");
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-1 flex-col lg:w-1/2">
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Iniciar sesión
                        </h1>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ingresa tu correo y contraseña para continuar
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <div>
                                <Label>
                                    Correo electrónico{" "}
                                    <span className="text-error-500">*</span>
                                </Label>

                                <Input
                                    placeholder="ejemplo@correo.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>
                                    Contraseña{" "}
                                    <span className="text-error-500">*</span>
                                </Label>

                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div />

                                <Link
                                    href="/reset-password"
                                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <div>
                                <Button
                                    className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                                    size="sm"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Ingresando..." : "Ingresar"}
                                </Button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-5">
                        <p className="text-center text-sm text-gray-700 dark:text-gray-400 sm:text-start">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                href="/signup"
                                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                            >
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}