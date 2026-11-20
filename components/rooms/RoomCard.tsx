import Link from "next/link";
import { Users, Pencil, Trash2, ArrowRight } from "lucide-react";
import { MeetingRoom } from "@/types/room";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

interface RoomCardProps {
  room: MeetingRoom;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoomCard({
  room,
  isAdmin,
  onEdit,
  onDelete,
}: RoomCardProps) {
  return (
    <div className="bg-surface border border-border hover:border-accent/40 rounded-2xl p-6 transition-all shadow-md flex flex-col justify-between gap-6 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Heading
            as="h3"
            size="md"
            className="text-foreground group-hover:text-accent-text transition-colors"
          >
            {room.name}
          </Heading>

          <div className="flex items-center gap-1.5 text-xs text-muted bg-surface-hover px-2.5 py-1 rounded-full shrink-0 border border-border">
            <Users className="w-3.5 h-3.5" />
            <span>{room.members?.length || 1}</span>
          </div>
        </div>

        <p className="text-sm text-muted line-clamp-3 leading-relaxed">
          {room.description || "No description provided."}
        </p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <Link
          href={`/rooms/${room.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-text transition-colors"
        >
          <span>View & Book</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              className="p-2 bg-surface-hover hover:bg-surface border border-border text-muted hover:text-foreground"
              title="Edit room"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              className="p-2 bg-surface-hover hover:bg-danger/20 border border-border text-muted hover:text-danger"
              title="Delete room"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
