// src/modules/people/components/form/PersonInfoSection.tsx

"use client";

import Label from "@/shared/components/form/Label";
import type { PersonFormState } from "./PersonForm";

type Props = {
  form: PersonFormState;
  onChange: (
    field: keyof Omit<PersonFormState, "missions" | "languages">,
    value: string
  ) => void;
};

export default function PersonInfoSection({ form, onChange }: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
        Información personal
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Ingresa los datos principales de la persona.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="first_name">Nombres</Label>

          <input
            id="first_name"
            type="text"
            value={form.first_name}
            onChange={(event) => onChange("first_name", event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="last_name">Apellidos</Label>

          <input
            id="last_name"
            type="text"
            value={form.last_name}
            onChange={(event) => onChange("last_name", event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="experience">Experiencia</Label>

          <input
            id="experience"
            type="text"
            value={form.experience}
            onChange={(event) => onChange("experience", event.target.value)}
            placeholder="Ej: 10 años"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="specialty">Especialidad</Label>

          <input
            id="specialty"
            type="text"
            value={form.specialty}
            onChange={(event) => onChange("specialty", event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="bio">Biografía</Label>

          <textarea
            id="bio"
            value={form.bio}
            onChange={(event) => onChange("bio", event.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            required
          />
        </div>
      </div>
    </section>
  );
}