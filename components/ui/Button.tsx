import { cn } from "@/lib/utils";
import Link from "next/link";

interface BaseProps {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  isIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

type AsButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsLinkProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = AsButtonProps | AsLinkProps;

function Button({
  isActive = false,
  size = "md",
  children,
  className,
  isIcon = false,
  disabled,
  ...props
}: ButtonProps) {
  const finalClasses = cn(
    `inline-flex items-center justify-center text-center rounded-2xl font-semibold cursor-pointer transition-colors`,
    size === "sm" && `text-xs py-1 px-3`,
    size === "md" && `text-base py-2 px-4`,
    size === "lg" && `text-lg py-3 px-5`,
    isIcon && "p-1 w-10 h-10",
    isActive && `shadow`,
    `disabled:shadow-none disabled:bg-muted/20 disabled:text-muted disabled:cursor-default disabled:pointer-events-none disabled:opacity-50`,
    className,
  );
  if (props.href) {
    const { href, ...linkProps } = props as AsLinkProps;
    return (
      <Link
        href={disabled ? "#" : href}
        aria-disabled={disabled}
        className={finalClasses}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as AsButtonProps;
  return (
    <button
      type={type}
      disabled={disabled}
      className={finalClasses}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default Button;
