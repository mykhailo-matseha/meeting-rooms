"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user)
    return (
      <Button href="/login" size="md">
        Login
      </Button>
    );

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const avatarLetter = (user.displayName || user.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 text-accent-text flex items-center justify-center font-bold text-sm shrink-0">
          {avatarLetter}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium text-foreground leading-none">
            {user.displayName || "User"}
          </span>
          <span className="text-xs text-muted leading-tight mt-1">
            {user.email}
          </span>
        </div>
      </div>
      <Button
        onClick={handleLogout}
        size="sm"
        className="bg-surface hover:bg-surface-hover text-muted hover:text-foreground border border-border flex items-center gap-2 px-3 py-1.5"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  );
}
