"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { bookingSchema } from "@/lib/schemas";
import { createBooking, updateBooking } from "@/services/bookings";
import { Booking } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  defaultDate?: string;
  initialData?: Booking | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  roomId,
  defaultDate,
  initialData,
}: BookingModalProps) {
  const { user } = useAuth();
  const today = defaultDate || new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(initialData?.date || today);
  const [startTime, setStartTime] = useState(initialData?.startTime || "10:00");
  const [endTime, setEndTime] = useState(initialData?.endTime || "11:00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    if (!user || !user.email) {
      setError("You must be logged in to book a room");
      return;
    }
    const validation = bookingSchema.safeParse({
      title,
      date,
      startTime,
      endTime,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      setIsLoading(true);
      if (initialData) {
        await updateBooking(initialData.id, {
          roomId,
          title: validation.data.title,
          date: validation.data.date,
          startTime: validation.data.startTime,
          endTime: validation.data.endTime,
        });
      } else {
        await createBooking(
          {
            roomId,
            title: validation.data.title,
            date: validation.data.date,
            startTime: validation.data.startTime,
            endTime: validation.data.endTime,
          },
          user.email,
          user.displayName || user.email.split("@")[0],
        );
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create booking");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Meeting Room">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <Alert>{error}</Alert>}

        <Field label="Meeting Title">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sprint Planning / Product Sync"
          />
        </Field>

        <Field label="Date">
          <Input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Time">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Field>

          <Field label="End Time">
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            size="md"
            className="bg-surface hover:bg-surface-hover border border-border text-muted hover:text-foreground"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="md">
            {isLoading
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Book Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
