import Input from "@/shared/components/form/input/InputField";
import FormSection from "@/shared/components/form/Form";

import { HeroFormState } from "./HomeHeroContentSection";

const counterFields: Array<{
  name: keyof HeroFormState;
  label: string;
}> = [
  {
    name: "destinations_count",
    label: "Destinos",
  },
  {
    name: "travelers_count",
    label: "Viajeros",
  },
  {
    name: "experiences_count",
    label: "Experiencias",
  },
  {
    name: "continents_count",
    label: "Continentes",
  },
];

interface Props {
  form: HeroFormState;
  onChange: (field: keyof HeroFormState, value: string) => void;
}

export default function HomeCountersSection({ form, onChange }: Props) {
  return (
    <FormSection
      title="Contadores"
      description="Estos valores se mostrarán como indicadores en el hero."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {counterFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type="number"
            min="0"
            value={form[field.name]}
            onValueChange={(value) => onChange(field.name, value)}
          />
        ))}
      </div>
    </FormSection>
  );
}