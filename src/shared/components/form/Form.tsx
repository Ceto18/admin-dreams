import React, { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}

export default function FormSection({
    title,
    description,
    action,
    children,
    className = "",
    contentClassName = "mt-6",
}: FormSectionProps) {
    return (
        <section
            className={`rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                {action && <div className="shrink-0">{action}</div>}
            </div>

            <div className={contentClassName}>{children}</div>
        </section>
    );
}