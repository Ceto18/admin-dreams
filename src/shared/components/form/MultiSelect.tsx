import React, { useEffect, useMemo, useState } from "react";

interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
  placeholder = "Selecciona opciones",
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

  const selectedValues = useMemo(() => {
    return selectedOptions
      .map((value) => {
        const option = options.find((item) => item.value === value);

        return option
          ? {
              value: option.value,
              text: option.text,
            }
          : null;
      })
      .filter(Boolean) as Array<{ value: string; text: string }>;
  }, [selectedOptions, options]);

  const visibleSelectedValues = selectedValues.slice(0, 2);
  const hiddenSelectedCount =
    selectedValues.length - visibleSelectedValues.length;

  const toggleDropdown = () => {
    if (disabled) return;

    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const handleRemoveOption = (
    event: React.MouseEvent<HTMLSpanElement>,
    optionValue: string
  ) => {
    event.stopPropagation();

    const newSelectedOptions = selectedOptions.filter(
      (value) => value !== optionValue
    );

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 w-full">
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className="
            flex
            h-11
            w-full
            items-center
            justify-between
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            text-left
            shadow-theme-xs
            outline-hidden
            transition
            focus:border-brand-300
            focus:shadow-focus-ring
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-gray-700
            dark:bg-gray-900
            dark:focus:border-brand-300
          "
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            {visibleSelectedValues.length > 0 ? (
              <>
                {visibleSelectedValues.map((option) => (
                  <span
                    key={option.value}
                    className="
                      flex
                      max-w-[150px]
                      items-center
                      gap-1
                      rounded-full
                      bg-gray-100
                      px-2.5
                      py-1
                      text-xs
                      text-gray-800
                      dark:bg-gray-800
                      dark:text-white/90
                    "
                  >
                    <span className="truncate">{option.text}</span>

                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) =>
                        handleRemoveOption(event, option.value)
                      }
                      className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ×
                    </span>
                  </span>
                ))}

                {hiddenSelectedCount > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    +{hiddenSelectedCount} más
                  </span>
                )}
              </>
            ) : (
              <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                {placeholder}
              </span>
            )}
          </div>

          <svg
            className={`ml-2 h-5 w-5 shrink-0 stroke-current text-gray-700 transition dark:text-gray-400 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              top-full
              z-40
              mt-2
              max-h-60
              w-full
              overflow-y-auto
              rounded-lg
              border
              border-gray-200
              bg-white
              shadow-lg
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              dark:border-gray-800
              dark:bg-gray-900
            "
          >
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-2 text-left text-sm transition last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.05] ${
                    isSelected ? "bg-brand-50 dark:bg-brand-500/10" : ""
                  }`}
                >
                  <span className="text-gray-800 dark:text-white/90">
                    {option.text}
                  </span>

                  {isSelected && (
                    <span className="text-xs font-medium text-brand-500">
                      Seleccionado
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;