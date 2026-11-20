"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MeetingRoom } from "@/types/room";
import Heading from "@/components/ui/Heading";
import Badge from "@/components/ui/Badge";
import { subscribeRoom } from "@/services/rooms";
import MemberList from "@/components/rooms/MembersList";
import AddMemberForm from "@/components/rooms/AddMemberForm";
import BookingList from "@/components/bookings/BookingList";
import { Booking } from "@/types";
import BookingModal from "@/components/bookings/BookingModal";
import {
  deleteBooking,
  subscribeRoomBookings,
  toggleJoinBooking,
} from "@/services/bookings";
import { cn } from "@/lib/utils";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

function RoomContent({ params }: RoomPageProps) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState<MeetingRoom | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeRoom(id, (data) => {
      setRoom(data);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeRoomBookings(id, (data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading || !user || !room) {
    return (
      <div className="grow flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const handleJoinLeave = async (booking: Booking) => {
    if (!currentUserEmail) return;
    try {
      await toggleJoinBooking(
        booking.id,
        booking.participants || [],
        currentUserEmail,
      );
    } catch (err) {
      console.error("Failed to toggle join/leave", err);
    }
  };
  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this meeting?")) {
      try {
        await deleteBooking(bookingId);
      } catch (err) {
        console.error("Failed to delete booking", err);
      }
    }
  };

  const currentUserEmail = user.email?.toLowerCase();
  const currentMember = room.members?.find((m) => m.email === currentUserEmail);
  const isAdmin =
    room.createdBy === currentUserEmail || currentMember?.role === "admin";

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col gap-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Rooms</span>
      </Link>
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Heading as="h1" size="lg" className="text-foreground">
                {room.name}
              </Heading>
              <Badge>{isAdmin ? "👑 Admin" : "👤 User"}</Badge>
            </div>
            <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
              {room.description || "No description provided."}
            </p>
          </div>

          <div className="text-xs text-muted self-start sm:self-auto bg-surface-hover px-3 py-1.5 rounded-xl border border-border">
            Created by <span className="text-foreground">{room.createdBy}</span>
          </div>
        </div>
      </div>
      <BookingList
        bookings={bookings}
        currentUserEmail={currentUserEmail}
        isAdmin={isAdmin}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onOpenBookModal={() => {
          setEditingBooking(null);
          setIsBookModalOpen(true);
        }}
        onJoinLeave={handleJoinLeave}
        onDeleteBooking={handleDeleteBooking}
        onEditBooking={(booking) => {
          setEditingBooking(booking);
          setIsBookModalOpen(true);
        }}
      />
      <div
        className={cn("grid gap-5", isAdmin && "sm:grid-cols-2 grid-cols-1")}
      >
        <MemberList
          roomId={room.id}
          isAdmin={isAdmin}
          members={room.members}
          currentUserEmail={currentUserEmail}
        />
        {isAdmin && <AddMemberForm roomId={room.id} />}
      </div>
      <BookingModal
        key={editingBooking ? editingBooking.id : "new-booking"}
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setEditingBooking(null);
        }}
        roomId={room.id}
        defaultDate={selectedDate}
        initialData={editingBooking}
      />
    </div>
  );
}

export default function RoomPage(props: RoomPageProps) {
  return (
    <Suspense
      fallback={
        <div className="grow flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RoomContent {...props} />
    </Suspense>
  );
}
