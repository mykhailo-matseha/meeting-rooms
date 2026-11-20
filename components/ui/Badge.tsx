import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  status?: "success" | "neutral" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function Badge({
  children,
  status = "neutral",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const finalClasses = cn(
    `inline-block rounded-full text-white text-center shrink-0`,
    size === "sm" && `text-xs py-1 px-3`,
    size === "md" && `text-lg py-1 px-3`,
    size === "lg" && `text-xl py-2 px-4`,
    status === "success" && "bg-success text-white",
    status === "neutral" && "bg-accent-soft text-accent-text",
    status === "warning" && "bg-warning text-white",
    status === "danger" && "bg-danger text-white",
    className,
  );
  return (
    <div className={finalClasses} {...props}>
      {children}
    </div>
  );
}

export default Badge;
