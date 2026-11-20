"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MeetingRoom } from "@/types/room";
import {
  subscribeRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/services/rooms";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import RoomCard from "@/components/rooms/RoomCard";
import RoomModal from "@/components/rooms/RoomModal";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<MeetingRoom | null>(null);
  const currentUserEmail = user?.email?.toLowerCase();

  const visibleRooms = rooms.filter(
    (room) =>
      room.createdBy === currentUserEmail ||
      room.members?.some((m) => m.email.toLowerCase() === currentUserEmail),
  );
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeRooms((data) => {
      setRooms(data);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleModalSubmit = async (name: string, description: string) => {
    if (editingRoom) {
      await updateRoom(editingRoom.id, name, description);
    } else {
      await createRoom(name, description, user.email || "unknown");
    }
    setEditingRoom(null);
  };

  const handleEditClick = (room: MeetingRoom) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await deleteRoom(roomId);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Heading as="h1" size="lg" className="text-foreground">
            Meeting Rooms
          </Heading>
          <Button
            onClick={() => {
              setEditingRoom(null);
              setIsModalOpen(true);
            }}
            className="bg-accent hover:bg-accent-hover text-white flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </Button>
        </div>

        {visibleRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface/50 border border-border border-dashed rounded-2xl text-center gap-3">
            <Heading as="h3" size="sm" className="text-foreground">
              No meeting rooms yet
            </Heading>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRooms.map((room) => {
              const userEmail = user.email?.toLowerCase();
              const isAdmin =
                room.createdBy === userEmail ||
                room.members?.some(
                  (m) => m.email === userEmail && m.role === "admin",
                );

              return (
                <RoomCard
                  key={room.id}
                  room={room}
                  isAdmin={Boolean(isAdmin)}
                  onEdit={() => handleEditClick(room)}
                  onDelete={() => handleDeleteClick(room.id)}
                />
              );
            })}
          </div>
        )}
      </div>
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingRoom
            ? { name: editingRoom.name, description: editingRoom.description }
            : null
        }
      />
    </>
  );
}
