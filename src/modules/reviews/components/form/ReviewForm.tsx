// src/modules/reviews/components/form/ReviewForm.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { Save, Trash2 } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import Select from "@/shared/components/form/Select";
import TextArea from "@/shared/components/form/input/TextArea";

import type {
  Review,
  ReviewState,
  UpdateReviewPayload,
} from "../../types";

interface Props {
  initialData: Review;
  loading?: boolean;
  deletingVideo?: boolean;

  onSubmit: (
    payload: UpdateReviewPayload
  ) => Promise<void>;

  /**
   * Solo solicita abrir el modal de confirmación.
   * La eliminación se ejecuta desde la página.
   */
  onDeleteVideo?: () => void;
}

const ratingOptions = [
  {
    value: "1",
    label: "1 estrella",
  },
  {
    value: "2",
    label: "2 estrellas",
  },
  {
    value: "3",
    label: "3 estrellas",
  },
  {
    value: "4",
    label: "4 estrellas",
  },
  {
    value: "5",
    label: "5 estrellas",
  },
];

const stateOptions = [
  {
    value: "approved",
    label: "Aprobada",
  },
  {
    value: "pending",
    label: "Pendiente",
  },
  {
    value: "denied",
    label: "Denegada",
  },
];

export default function ReviewForm({
  initialData,
  loading = false,
  deletingVideo = false,
  onSubmit,
  onDeleteVideo,
}: Props) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [state, setState] =
    useState<ReviewState>("pending");

  useEffect(() => {
    setComment(initialData.comment ?? "");
    setRating(initialData.rating ?? 1);
    setState(getReviewState(initialData));
  }, [initialData]);

  const disabled =
    loading || deletingVideo;

  const hasChanges = useMemo(() => {
    const initialComment =
      initialData.comment?.trim() ?? "";

    const initialRating =
      initialData.rating ?? 1;

    const initialState =
      getReviewState(initialData);

    return (
      comment.trim() !== initialComment ||
      rating !== initialRating ||
      state !== initialState
    );
  }, [
    comment,
    rating,
    state,
    initialData,
  ]);

  const handleRatingChange = (
    value: string
  ) => {
    const nextRating = Number(value);

    if (
      Number.isNaN(nextRating) ||
      nextRating < 1 ||
      nextRating > 5
    ) {
      return;
    }

    setRating(nextRating);
  };

  const handleStateChange = (
    value: string
  ) => {
    if (!isReviewState(value)) {
      return;
    }

    setState(value);
  };

  const handleCommentChange = (
    value: string
  ) => {
    setComment(value.slice(0, 2000));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (disabled) return;

    const normalizedComment =
      comment.trim();

    if (!normalizedComment) {
      message.warning(
        "Debes ingresar un comentario."
      );

      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      message.warning(
        "La calificación debe estar entre 1 y 5."
      );

      return;
    }

    await onSubmit({
      comment: normalizedComment,
      rating,
      state,
    });
  };

  const handleRequestDeleteVideo = () => {
    if (
      disabled ||
      !initialData.video_url ||
      !onDeleteVideo
    ) {
      return;
    }

    onDeleteVideo();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Información de la reseña
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consulta la persona y el contenido relacionado con esta reseña.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            label="Persona"
            value={
              initialData.name || "-"
            }
          />

          <DetailItem
            label="Misión"
            value={
              initialData.mission_name ||
              "-"
            }
          />

          <DetailItem
            label="Experiencia"
            value={
              initialData.experience_name ||
              "-"
            }
          />

          <DetailItem
            label="Momento"
            value={
              initialData.moment_name ||
              "-"
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Datos editables
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Modifica el comentario, la calificación y el estado de la reseña.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Calificación
            </label>

            <Select
              options={ratingOptions}
              value={String(rating)}
              onChange={
                handleRatingChange
              }
              disabled={disabled}
              placeholder="Selecciona una calificación"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado
            </label>

            <Select
              options={stateOptions}
              value={state}
              onChange={
                handleStateChange
              }
              disabled={disabled}
              placeholder="Selecciona un estado"
            />
          </div>
        </div>

        <div className="mt-5">
          <TextArea
            label="Comentario"
            value={comment}
            onChange={
              handleCommentChange
            }
            rows={6}
            disabled={disabled}
            placeholder="Ingresa el comentario de la reseña..."
            hint={`${comment.length}/2000 caracteres`}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Video
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Visualiza o elimina el video asociado a la reseña.
            </p>
          </div>

          {initialData.video_url &&
            onDeleteVideo && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                startIcon={
                  <Trash2 size={16} />
                }
                disabled={disabled}
                onClick={
                  handleRequestDeleteVideo
                }
              >
                {deletingVideo
                  ? "Eliminando video..."
                  : "Eliminar video"}
              </Button>
            )}
        </div>

        {initialData.video_url ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-800">
            <video
              key={
                initialData.video_url
              }
              src={
                initialData.video_url
              }
              controls
              preload="metadata"
              className="max-h-[520px] w-full"
            >
              Tu navegador no puede reproducir este video.
            </video>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esta reseña no tiene un video asociado.
            </p>
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          startIcon={
            <Save size={17} />
          }
          disabled={
            disabled || !hasChanges
          }
        >
          {loading
            ? "Guardando cambios..."
            : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

function getReviewState(
  review: Review
): ReviewState {
  if (review.state) {
    return review.state;
  }

  return review.is_approved
    ? "approved"
    : "pending";
}

function isReviewState(
  value: string
): value is ReviewState {
  return (
    value === "approved" ||
    value === "pending" ||
    value === "denied"
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}