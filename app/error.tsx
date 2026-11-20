"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Heading from "@/components/ui/Heading";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Логуємо неочікувану помилку в консоль
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full flex flex-col items-center text-center gap-5">
        <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Heading as="h1" size="md" className="text-foreground">
            Something went wrong!
          </Heading>
          <p className="text-sm text-muted">
            {error.message ||
              "An unexpected error occurred while loading this page."}
          </p>
        </div>
        <Link
          href="/"
          className="flex-1 py-2 px-4 rounded-2xl border border-border bg-surface hover:bg-surface-hover text-muted hover:text-foreground text-sm font-semibold text-center transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
