"use client";

import Image from "next/image";

import { MissionExperience } from "../types";

interface Props {
  experience: MissionExperience;
}

export default function MissionExperienceDetail({ experience }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          Experiencia
        </span>

        <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
          {experience.name}
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {experience.short_description || "Sin descripción corta"}
        </p>
      </div>

      {experience.images && experience.images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experience.images.map((image) => (
            <div
              key={image.uuid}
              className="relative h-56 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
            >
              <Image
                src={image.image_url}
                alt={image.name || "Imagen de experiencia"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Información general
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Info label="Fecha de salida" value={experience.release_date} />
              <Info label="Cupos" value={experience.number_seats} />
              <Info label="Cupos usados" value={experience.seats_used} />
              <Info label="Días" value={experience.days} />
              <Info label="Noches" value={experience.nights} />
              <Info label="Rating" value={experience.raiting} />
              <Info label="Inversión" value={`S/ ${experience.investment}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {experience.subtitle || "Descripción"}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {experience.long_description || "Sin descripción extensa."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Características
            </h2>

            <div className="mt-4 space-y-3">
              {experience.features && experience.features.length > 0 ? (
                experience.features.map((item) => (
                  <div
                    key={item.uuid}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300"
                  >
                    {item.feature}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay características registradas.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Itinerario
            </h2>

            <div className="mt-4 space-y-4">
              {experience.itineraries && experience.itineraries.length > 0 ? (
                experience.itineraries.map((item) => (
                  <div
                    key={item.uuid}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      Día {item.day}
                    </span>

                    <h3 className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay itinerario registrado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <p className="text-xs font-medium uppercase text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
        {value ?? "-"}
      </p>
    </div>
  );
}