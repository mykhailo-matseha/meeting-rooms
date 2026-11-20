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

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

function RoomContent({ params }: RoomPageProps) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState<MeetingRoom | null>(null);

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

  if (loading || !user || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
      <div className="grid grid-cols-2 gap-5">
        <MemberList
          members={room.members}
          currentUserEmail={currentUserEmail}
        />
        {isAdmin && <AddMemberForm roomId={room.id} />}
      </div>
    </div>
  );
}

export default function RoomPage(props: RoomPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RoomContent {...props} />
    </Suspense>
  );
}
