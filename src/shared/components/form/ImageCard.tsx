import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  badge: string;
  badgeClassName?: string;
  containerClassName?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  disabled?: boolean;
}

export default function ImageCard({
  src,
  alt,
  badge,
  badgeClassName = "bg-black/60",
  containerClassName = "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
  buttonText,
  onButtonClick,
  disabled = false,
}: ImageCardProps) {
  return (
    <div
      className={`relative h-40 overflow-hidden rounded-xl border ${containerClassName}`}
    >
      <Image src={src} alt={alt} fill unoptimized className="object-cover" />

      <div
        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white ${badgeClassName}`}
      >
        {badge}
      </div>

      {buttonText && onButtonClick && (
        <button
          type="button"
          disabled={disabled}
          onClick={onButtonClick}
          className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}