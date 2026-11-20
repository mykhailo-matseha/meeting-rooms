"use client";
import Heading from "@/components/ui/Heading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="grow flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) {
    return null;
  }

  return (
    <div className="grow flex items-center justify-center p-4">
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
    </div>
  );
}
