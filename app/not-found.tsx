import Link from "next/link";
import { Compass } from "lucide-react";
import Heading from "@/components/ui/Heading";

export default function NotFound() {
  return (
    <div className="grow flex items-center justify-center bg-background px-4">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full flex flex-col items-center text-center gap-5">
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
          <Compass className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            404 Error
          </span>
          <Heading as="h1" size="md" className="text-foreground">
            Page Not Found
          </Heading>
        </div>

        <Link
          href="/"
          className="w-full mt-2 py-2.5 px-4 rounded-2xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
