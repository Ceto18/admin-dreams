import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";
import Select from "@/shared/components/form/Select";
import FormSection from "@/shared/components/form/Form";

import {
  ExperienceField,
  MissionExperienceFormState,
} from "./types";

interface Props {
  form: MissionExperienceFormState;
  fields: ExperienceField[];
  onChange: (
    field: keyof MissionExperienceFormState,
    value: string
  ) => void;
}

export default function MissionExperienceInfoSection({
  form,
  fields,
  onChange,
}: Props) {
  return (
    <FormSection
      title="Información de la experiencia"
      description="Completa los datos principales de la experiencia."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {fields.map((field) => {
          const value = form[field.name];

          if (field.type === "select") {
            return (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {field.label}
                </label>

                <Select
                  options={field.options ?? []}
                  value={value}
                  placeholder={
                    field.placeholder ??
                    `Selecciona ${field.label.toLowerCase()}`
                  }
                  onChange={(selectedValue) =>
                    onChange(field.name, selectedValue)
                  }
                />
              </div>
            );
          }

          return (
            <Input
              key={field.name}
              label={field.label}
              type={field.type ?? "text"}
              step={field.step}
              value={value}
              placeholder={field.placeholder}
              onValueChange={(inputValue) =>
                onChange(field.name, inputValue)
              }
            />
          );
        })}
      </div>

      <TextArea
        label="Descripción larga"
        value={form.long_description}
        rows={5}
        placeholder="Escribe la descripción completa de la experiencia..."
        className="mt-5"
        onChange={(value) =>
          onChange("long_description", value)
        }
      />
    </FormSection>
  );
}
