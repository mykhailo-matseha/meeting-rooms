"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RadioProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function Radio({
  id,
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
}: RadioProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex items-center gap-3 cursor-pointer select-none text-sm font-light",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className,
      )}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          "w-6 h-6 rounded-full border border-border bg-surface flex items-center justify-center transition-colors shrink-0",
          "group-hover:border-accent",
          checked && "border-accent bg-accent",
        )}
      >
        <Check
          className={cn(
            "w-3.5 h-3.5 opacity-0 pointer-events-none transition-opacity",
            checked && "text-white opacity-100",
          )}
        />
      </div>
      {label && (
        <span className="text-muted group-hover:text-foreground transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
