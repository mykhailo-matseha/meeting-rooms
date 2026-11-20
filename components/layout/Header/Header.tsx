import Link from "next/link";
import { Calendar } from "lucide-react";
import UserNav from "./UserNav";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <div className=" text-white flex items-center justify-center shadow-md">
              <Calendar />
            </div>
            <span>MeetingRooms</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Rooms
            </Link>
          </nav>
        </div>
        <UserNav />
      </div>
    </header>
  );
}
