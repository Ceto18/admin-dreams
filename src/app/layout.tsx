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
    title: "Qori Admin",
    description: "Panel administrativo Qori",
    icons: {
        icon: "/images/logo/qori-logo.png",
        shortcut: "/images/logo/qori-logo.png",
        apple: "/images/logo/qori-logo.png",
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