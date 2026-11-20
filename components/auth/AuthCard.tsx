import Heading from "@/components/ui/Heading";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <Heading as="h1" size="lg" className="text-foreground">
            {title}
          </Heading>
          <p className="text-sm text-muted mt-1">{description}</p>
        </div>

        {children}

        {footer}
      </div>
    </main>
  );
}
