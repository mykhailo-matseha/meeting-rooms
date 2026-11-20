import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full bg-surface border border-border rounded-xl py-2 px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-all",
          "focus:border-accent focus:ring-2 focus:ring-accent/20",
          icon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
