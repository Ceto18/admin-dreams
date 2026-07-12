// src/modules/people/components/form/PersonLanguagesSection.tsx

"use client";

import MultiSelect from "@/shared/components/form/MultiSelect";
import type { Language } from "../../types";

type Props = {
  languages: Language[];
  selectedLanguages: string[];
  loadingLanguages?: boolean;
  onChange: (values: string[]) => void;
};

export default function PersonLanguagesSection({
  languages,
  selectedLanguages,
  loadingLanguages = false,
  onChange,
}: Props) {
  const languageOptions = languages.map((language) => ({
    value: language.uuid,
    text: `${language.name} (${language.code})`,
    selected: selectedLanguages.includes(language.uuid),
  }));

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
        Idiomas
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Puedes seleccionar varios idiomas.
      </p>

      <div className="mt-5">
        <MultiSelect
          label={loadingLanguages ? "Idiomas - cargando..." : "Idiomas"}
          options={languageOptions}
          defaultSelected={selectedLanguages}
          onChange={onChange}
          disabled={loadingLanguages}
        />
      </div>
    </section>
  );
}