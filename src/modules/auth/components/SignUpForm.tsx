"use client";

import Input from "@/shared/components/form/input/InputField";
import Label from "@/shared/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/shared/icons";
import Link from "next/link";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { registerRequest } from "../services/authService";
import Button from "@/shared/components/ui/button/Button";
import toast from "react-hot-toast";

export default function SignUpForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [typeDocument, setTypeDocument] = useState("DNI");
    const [document, setDocument] = useState("");
    const [countryCode, setCountryCode] = useState("+51");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");
    const [department, setDepartment] = useState("");
    const [country, setCountry] = useState("Perú");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !name.trim() ||
            !lastName.trim() ||
            !typeDocument.trim() ||
            !document.trim() ||
            !countryCode.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !district.trim() ||
            !province.trim() ||
            !department.trim() ||
            !country.trim() ||
            !email.trim() ||
            !password.trim() ||
            !passwordConfirmation.trim()
        ) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        if (password !== passwordConfirmation) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        const toastId = toast.loading("Creando cuenta...");

        try {
            await registerRequest({
                email,
                password,
                password_confirmation: passwordConfirmation,

                name,
                last_name: lastName,
                type_document: typeDocument,
                document,
                country_code: countryCode,
                phone,
                address,
                district,
                province,
                department,
                country,
            });

            toast.success("Cuenta creada correctamente", {
                id: toastId,
            });

            router.replace("/signin");
        } catch (error: any) {
            console.error(error);

            const responseData = error?.response?.data;

            let errorMessage = responseData?.message ?? "Error al registrarse";

            if (responseData?.errors) {
                const firstErrorKey = Object.keys(responseData.errors)[0];
                const firstError = responseData.errors[firstErrorKey];

                if (Array.isArray(firstError) && firstError.length > 0) {
                    errorMessage = firstError[0];
                }
            }

            toast.error(errorMessage, {
                id: toastId,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-1 flex-col overflow-y-auto no-scrollbar lg:w-1/2">
            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Crear cuenta
                        </h1>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Crea una cuenta ingresando tus datos personales
                        </p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>
                                        Nombre{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ingresa tu nombre"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>
                                        Apellido{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ingresa tu apellido"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>
                                        Tipo de documento{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>

                                    <select
                                        value={typeDocument}
                                        onChange={(e) =>
                                            setTypeDocument(e.target.value)
                                        }
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                    >
                                        <option value="DNI">DNI</option>
                                        <option value="CE">Carnet de extranjería</option>
                                        <option value="PASAPORTE">Pasaporte</option>
                                        <option value="RUC">RUC</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>
                                        Número de documento{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: 12345678"
                                        value={document}
                                        onChange={(e) =>
                                            setDocument(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[120px_1fr]">
                                <div>
                                    <Label>
                                        Código{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="+51"
                                        value={countryCode}
                                        onChange={(e) =>
                                            setCountryCode(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>
                                        Teléfono{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: 909090909"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Dirección{" "}
                                    <span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Ej: Av. Las Lomas 123"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>
                                        Distrito{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Lima"
                                        value={district}
                                        onChange={(e) =>
                                            setDistrict(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>
                                        Provincia{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Lima"
                                        value={province}
                                        onChange={(e) =>
                                            setProvince(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <Label>
                                        Departamento{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Lima"
                                        value={department}
                                        onChange={(e) =>
                                            setDepartment(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>
                                        País{" "}
                                        <span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Perú"
                                        value={country}
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Correo electrónico{" "}
                                    <span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
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
                                        placeholder="Ingresa tu contraseña"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
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

                            <div>
                                <Label>
                                    Confirmar contraseña{" "}
                                    <span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirma tu contraseña"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                                </Button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-5">
                        <p className="text-center text-sm text-gray-700 dark:text-gray-400 sm:text-start">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                href="/signin"
                                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}