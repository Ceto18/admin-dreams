import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Dreams Admin",
  description: "Centro de control administrativo de Dreams",
};

const controlStats = [
  {
    id: 1,
    label: "Landing",
    value: "92%",
    helper: "Contenido actualizado",
  },
  {
    id: 2,
    label: "Paquetes",
    value: "14",
    helper: "Experiencias registradas",
  },
  {
    id: 3,
    label: "Galería",
    value: "128",
    helper: "Fotos publicadas",
  },
  {
    id: 4,
    label: "Contactos",
    value: "21",
    helper: "Solicitudes recibidas",
  },
];

const quickActions = [
  {
    id: 1,
    title: "Crear paquete",
    description: "Agrega una nueva experiencia de viaje con precios, fotos y descripción.",
    href: "/packages/create",
  },
  {
    id: 2,
    title: "Editar portada",
    description: "Actualiza el título principal, subtítulo e imagen hero de la landing.",
    href: "/content/home",
  },
  {
    id: 3,
    title: "Subir galería",
    description: "Carga nuevas fotografías para mostrar momentos y experiencias Dreams.",
    href: "/gallery",
  },
  {
    id: 4,
    title: "Revisar contactos",
    description: "Consulta las solicitudes enviadas por usuarios desde la página web.",
    href: "/contacts",
  },
];

const siteHealth = [
  {
    id: 1,
    title: "Hero principal",
    status: "Completo",
    percent: "100%",
  },
  {
    id: 2,
    title: "Paquetes destacados",
    status: "Revisar",
    percent: "75%",
  },
  {
    id: 3,
    title: "Galería de fotos",
    status: "Activo",
    percent: "88%",
  },
  {
    id: 4,
    title: "Reseñas",
    status: "Pendiente",
    percent: "60%",
  },
];

const highlights = [
  {
    id: 1,
    title: "Paquete destacado",
    value: "Aventura Premium",
    description: "Última experiencia agregada a la landing.",
  },
  {
    id: 2,
    title: "Última sección editada",
    value: "Momentos Dreams",
    description: "Se actualizaron textos e imágenes.",
  },
  {
    id: 3,
    title: "Próxima acción sugerida",
    value: "Revisar reseñas",
    description: "Hay testimonios listos para publicar.",
  },
];

function CompassIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21.25a9.25 9.25 0 100-18.5 9.25 9.25 0 000 18.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 8.5l-2.15 5.1a1 1 0 01-.54.54L7.7 16.3l2.15-5.1a1 1 0 01.54-.54L15.5 8.5z"
      />
    </svg>
  );
}

function SparkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9L12 3.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.5 15.5l.75 2 .75-2 2-.75-2-.75-.75-2-.75 2-2 .75 2 .75z"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6l6 6-6 6"
      />
    </svg>
  );
}

export default function Ecommerce() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-950 p-6 text-white dark:border-gray-800">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-center">
          <div className="xl:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <SparkIcon className="h-4 w-4" />
              Dreams Control Center
            </span>

            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
              Controla la experiencia digital de Dreams desde una sola cabina.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              Gestiona la landing, paquetes de viaje, fotografías, reseñas,
              textos principales y solicitudes de contacto con una vista rápida
              del estado general del sitio.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/packages/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-950 transition hover:bg-white/90"
              >
                Crear paquete
                <ArrowIcon />
              </Link>

              <Link
                href="/content/home"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                Editar landing
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Estado general</p>
                  <h2 className="mt-1 text-2xl font-semibold">Dreams Web</h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-950">
                  <CompassIcon />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Contenido publicado</span>
                  <span className="font-medium text-white">92%</span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[92%] rounded-full bg-white" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-semibold">14</p>
                  <p className="mt-1 text-xs text-white/60">Paquetes activos</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-semibold">21</p>
                  <p className="mt-1 text-xs text-white/60">Contactos nuevos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {controlStats.map((stat) => (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold text-gray-800 dark:text-white/90">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.helper}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* QUICK ACTIONS */}
        <div className="col-span-12 xl:col-span-7">
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  Acciones de cabina
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Atajos principales para mantener Dreams actualizado.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                      <SparkIcon />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-gray-800 dark:text-white/90">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-500 group-hover:text-brand-600">
                      Abrir módulo
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* SITE HEALTH */}
        <div className="col-span-12 xl:col-span-5">
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Pulso de la landing
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Estado rápido de las secciones principales.
            </p>

            <div className="mt-6 space-y-5">
              {siteHealth.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.status}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.percent}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: item.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/content"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            >
              Optimizar contenido
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Radar Dreams
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Lo más importante que deberías revisar ahora.
            </p>
          </div>

          <Link
            href="/activity"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Ver actividad
            <ArrowIcon />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.title}
              </p>

              <h3 className="mt-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                {item.value}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}