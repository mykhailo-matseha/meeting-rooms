"use client";

import { Trash, Users } from "lucide-react";
import { RoomMember } from "@/types/user";
import Heading from "@/components/ui/Heading";
import Button from "../ui/Button";
import { removeRoomMember } from "@/services/rooms";
import Badge from "../ui/Badge";

interface MemberListProps {
  roomId: string;
  members: RoomMember[];
  currentUserEmail?: string;
  isAdmin: boolean;
}

export default function MemberList({
  roomId,
  isAdmin,
  members,
  currentUserEmail,
}: MemberListProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-accent" />
        <Heading as="h2" size="sm" className="text-foreground">
          Room Members ({members.length})
        </Heading>
      </div>

      <div className="divide-y divide-border">
        {members.map((member) => {
          const isCurrentUser = member.email === currentUserEmail;
          return (
            <div
              key={member.email}
              className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center text-muted font-bold text-xs uppercase">
                  {member.email.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {member.email}
                    {isCurrentUser && <span className="font-bold"> (You)</span>}
                  </div>
                  <Badge size="sm">
                    {member.role === "admin" ? "Admin" : "User"}
                  </Badge>
                </div>
              </div>

              {isAdmin && member.email !== currentUserEmail && (
                <Button
                  onClick={async () => {
                    if (confirm(`Remove ${member.email} from this room?`)) {
                      await removeRoomMember(roomId, member.email);
                    }
                  }}
                  isIcon
                  className="bg-danger hover:bg-accent-hover"
                >
                  <Trash />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
