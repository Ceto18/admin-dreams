import Input from "@/shared/components/form/input/InputField";
import FormSection from "@/shared/components/form/Form";
import Button from "@/shared/components/ui/button/Button";

interface Props {
  features: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}

export default function MissionExperienceFeaturesSection({
  features,
  onAdd,
  onRemove,
  onChange,
}: Props) {
  return (
    <FormSection
      title="Características"
      description="Agrega las características incluidas en la experiencia."
      action={
        <Button size="sm" variant="outline" onClick={onAdd}>
          Agregar característica
        </Button>
      }
    >
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-3">
            <Input
              value={feature}
              placeholder={`Característica ${index + 1}`}
              onValueChange={(value) => onChange(index, value)}
            />

            <Button
              size="sm"
              variant="danger"
              onClick={() => onRemove(index)}
            >
              Quitar
            </Button>
          </div>
        ))}
      </div>
    </FormSection>
  );
}