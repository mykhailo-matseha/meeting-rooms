"use client";

import { Users } from "lucide-react";
import { RoomMember } from "@/types/user";
import Heading from "@/components/ui/Heading";
import Badge from "@/components/ui/Badge";

interface MemberListProps {
  members: RoomMember[];
  currentUserEmail?: string;
}

export default function MemberList({
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
                  <div className="text-sm font-medium text-foreground">
                    {member.email}
                    {isCurrentUser && " (You)"}
                  </div>
                  <div className="text-xs text-muted capitalize">
                    Role: {member.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge size="sm">
                  {member.role === "admin" ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
