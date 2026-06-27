import GridShape from "@/shared/components/ui/common/GridShape";
import ThemeTogglerTwo from "@/shared/components/ui/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/shared/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
                <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
                    {children}

                    <div className="lg:w-1/2 w-full h-full bg-[#020617] dark:bg-white/5 lg:grid items-center hidden">
                        <div className="relative items-center justify-center flex z-1">
                            <GridShape />

                            <div className="flex flex-col items-center w-full max-w-2xl px-8">
                                <Link href="/" className="block mb-6">
                                    <Image
                                        width={640}
                                        height={180}
                                        src="/images/logo/logo-100.png"
                                        alt="DreamsPlanetXP Logo"
                                        priority
                                        className="w-[430px] lg:w-[540px] xl:w-[620px] h-auto object-contain"
                                    />
                                </Link>

                                <p className="max-w-sm text-center text-gray-400 dark:text-white/60">
                                    Administra experiencias de viaje, misiones y momentos únicos desde un solo lugar.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}