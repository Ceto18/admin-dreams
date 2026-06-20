import { RefObject } from "react";

import FileInput from "@/shared/components/form/input/FileInput";
import FormSection from "@/shared/components/form/Form";
import Button from "@/shared/components/ui/button/Button";

interface Props {
  currentFileUrl?: string | null;
  documentFile: File | null;
  documentInputRef: RefObject<HTMLInputElement | null>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function MissionExperienceFileSection({
  currentFileUrl,
  documentFile,
  documentInputRef,
  onChange,
  onRemove,
}: Props) {
  return (
    <FormSection
      title="Archivo de la experiencia"
      description="Sube el archivo PDF asociado a la experiencia."
    >
      {currentFileUrl && !documentFile && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            Archivo actual
          </p>

          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Ver archivo actual
          </a>
        </div>
      )}

      {documentFile && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Nuevo archivo seleccionado
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {documentFile.name}
            </p>
          </div>

          <Button size="sm" variant="danger" onClick={onRemove}>
            Quitar
          </Button>
        </div>
      )}

      <FileInput
        ref={documentInputRef}
        id="experience-document"
        name="file_url"
        accept="application/pdf"
        onChange={onChange}
      />
    </FormSection>
  );
}