import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";
import FormSection from "@/shared/components/form/Form";
import Button from "@/shared/components/ui/button/Button";

import { ItineraryFormState } from "./types";

interface Props {
  itineraries: ItineraryFormState[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    field: keyof ItineraryFormState,
    value: string
  ) => void;
}

export default function MissionExperienceItinerarySection({
  itineraries,
  onAdd,
  onRemove,
  onChange,
}: Props) {
  return (
    <FormSection
      title="Itinerario"
      description="Agrega los días y actividades del itinerario."
      action={
        <Button size="sm" variant="outline" onClick={onAdd}>
          Agregar itinerario
        </Button>
      }
    >
      <div className="space-y-5">
        {itineraries.map((itinerary, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Itinerario {index + 1}
              </h3>

              <Button
                size="sm"
                variant="danger"
                onClick={() => onRemove(index)}
              >
                Quitar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Input
                label="Día"
                type="number"
                value={itinerary.day}
                placeholder="Ej: 1"
                onValueChange={(value) => onChange(index, "day", value)}
              />

              <Input
                label="Orden"
                type="number"
                value={itinerary.order}
                placeholder="Ej: 1"
                onValueChange={(value) => onChange(index, "order", value)}
              />

              <Input
                label="Título"
                value={itinerary.title}
                placeholder="Ej: Aterrizaje de emergencia"
                onValueChange={(value) => onChange(index, "title", value)}
              />

              <TextArea
                label="Descripción"
                value={itinerary.description}
                rows={3}
                placeholder="Ej: Avión peligroso"
                className="lg:col-span-2"
                onChange={(value) => onChange(index, "description", value)}
              />
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}