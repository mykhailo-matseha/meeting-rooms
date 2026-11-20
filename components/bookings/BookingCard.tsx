"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import { Booking } from "@/types/booking";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface BookingCardProps {
  booking: Booking;
  currentUserEmail?: string;
  isAdmin: boolean;
  onEdit: (booking: Booking) => void;
  onJoinLeave: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
}

export default function BookingCard({
  booking,
  currentUserEmail,
  isAdmin,
  onJoinLeave,
  onDelete,
  onEdit,
}: BookingCardProps) {
  const isParticipant =
    currentUserEmail && booking.participants?.includes(currentUserEmail);
  const canManage = isAdmin || booking.createdBy === currentUserEmail;

  return (
    <div className="p-4 rounded-xl border border-border bg-surface-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <Badge size="sm">
            {booking.startTime} - {booking.endTime}
          </Badge>
          <h3 className="font-semibold text-foreground text-sm">
            {booking.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            Host:{" "}
            <span className="text-foreground">
              {booking.createdByName || booking.createdBy}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{booking.participants?.length || 0} joined</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button
          type="button"
          onClick={() => onJoinLeave(booking)}
          size="sm"
          className={
            isParticipant
              ? "bg-surface hover:bg-surface-hover border border-border text-muted hover:text-danger"
              : "bg-accent hover:bg-accent-hover text-white"
          }
        >
          {isParticipant ? "Leave Meeting" : "Join"}
        </Button>

        {canManage && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="p-2 text-muted hover:text-foreground rounded-lg transition-colors cursor-pointer"
              title="Edit meeting"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(booking.id)}
              className="p-2 text-muted hover:text-danger rounded-lg transition-colors cursor-pointer"
              title="Cancel meeting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
