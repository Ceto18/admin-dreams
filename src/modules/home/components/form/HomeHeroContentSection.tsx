import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";
import FormSection from "@/shared/components/form/Form";

export type HeroFormState = {
  title: string;
  highlight_text: string;
  description: string;
  destinations_count: string;
  travelers_count: string;
  experiences_count: string;
  continents_count: string;
};

interface Props {
  form: HeroFormState;
  onChange: (field: keyof HeroFormState, value: string) => void;
}

export default function HomeHeroContentSection({ form, onChange }: Props) {
  return (
    <FormSection
      title="Hero principal"
      description="Actualiza el contenido principal que aparece en la portada de Dreams."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Input
          label="Título"
          value={form.title}
          placeholder="Ej: Vive experiencias únicas"
          onValueChange={(value) => onChange("title", value)}
        />

        <Input
          label="Texto destacado"
          value={form.highlight_text}
          placeholder="Ej: con Dreams"
          onValueChange={(value) => onChange("highlight_text", value)}
        />

        <TextArea
          label="Descripción"
          value={form.description}
          placeholder="Describe la propuesta principal de Dreams"
          rows={4}
          className="lg:col-span-2"
          onChange={(value) => onChange("description", value)}
        />
      </div>
    </FormSection>
  );
}