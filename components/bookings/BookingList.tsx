"use client";

import { Calendar, Clock, Plus } from "lucide-react";
import { Booking } from "@/types/booking";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import BookingCard from "./BookingCard";
import Input from "../ui/Input";

interface BookingListProps {
  bookings: Booking[];
  currentUserEmail?: string;
  isAdmin: boolean;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenBookModal: () => void;
  onJoinLeave: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export default function BookingList({
  bookings,
  currentUserEmail,
  isAdmin,
  selectedDate,
  onDateChange,
  onOpenBookModal,
  onJoinLeave,
  onDeleteBooking,
}: BookingListProps) {
  const dayBookings = bookings.filter((b) => b.date === selectedDate);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          <Heading as="h2" size="sm" className="text-foreground">
            Schedule & Bookings
          </Heading>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />

          {isAdmin && (
            <Button onClick={onOpenBookModal} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Book Room</span>
            </Button>
          )}
        </div>
      </div>

      {dayBookings.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-border rounded-xl">
          <Clock className="w-8 h-8 text-muted/50" />
          <p className="text-sm text-muted">
            No bookings scheduled for this date.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dayBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUserEmail={currentUserEmail}
              isAdmin={isAdmin}
              onJoinLeave={onJoinLeave}
              onDelete={onDeleteBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
