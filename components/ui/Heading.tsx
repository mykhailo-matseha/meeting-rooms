import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function Heading({
  as: Component = "h2",
  children,
  className,
  size = "md",
  ...props
}: HeadingProps) {
  const finalClasses = cn(
    `font-bold`,
    size == "sm" && `text-lg`,
    size == "md" && `text-xl`,
    size == "lg" && `text-2xl md:text-3xl`,
    className,
  );
  return (
    <Component className={finalClasses} {...props}>
      {children}
    </Component>
  );
}

export default Heading;
