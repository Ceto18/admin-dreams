// src/app/layout.tsx
import { Outfit } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.css";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
    subsets: ["latin"],
});

export const metadata = {
    title: "Dreams Admin",
    description: "Panel administrativo DreamsPlanetXP",
    icons: {
        icon: "/images/logo/logo-d.png",
        shortcut: "/images/logo/logo-d.png",
        apple: "/images/logo/logo-d.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <ThemeProvider>
                    {children}

                    <Toaster
                        position="top-center"
                        containerStyle={{
                            top: 80,
                        }}
                        toastOptions={{
                            duration: 3500,
                            style: {
                                fontSize: "14px",
                                borderRadius: "12px",
                                padding: "12px 16px",
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}