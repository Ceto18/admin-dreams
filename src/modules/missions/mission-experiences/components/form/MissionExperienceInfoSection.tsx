import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";
import FormSection from "@/shared/components/form/Form";

import { ExperienceField, MissionExperienceFormState } from "./types";

interface Props {
  form: MissionExperienceFormState;
  fields: ExperienceField[];
  onChange: (field: keyof MissionExperienceFormState, value: string) => void;
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
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            step={field.step}
            value={form[field.name]}
            placeholder={field.placeholder}
            onValueChange={(value) => onChange(field.name, value)}
          />
        ))}
      </div>

      <TextArea
        label="Descripción larga"
        value={form.long_description}
        rows={5}
        placeholder="Escribe la descripción completa de la experiencia..."
        className="mt-5"
        onChange={(value) => onChange("long_description", value)}
      />
    </FormSection>
  );
}