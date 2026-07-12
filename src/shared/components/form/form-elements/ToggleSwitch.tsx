"use client";

import { useState } from "react";

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray" | "success";
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "success",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;

    const newCheckedState = !isChecked;

    setIsChecked(newCheckedState);
    onChange?.(newCheckedState);
  };

  const getActiveColor = () => {
    if (color === "gray") return "bg-gray-600";
    if (color === "blue") return "bg-blue-500";

    return "bg-green-500";
  };

  const activeColor = getActiveColor();
  const inactiveColor = "bg-gray-300 dark:bg-gray-700";

  return (
    <label
      className={`flex cursor-pointer items-center gap-3 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
        />

        <div
          className={`block h-6 w-11 rounded-full transition-colors duration-200 ${
            isChecked ? activeColor : inactiveColor
          }`}
        />

        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            isChecked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>

      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;