import { RoomMember } from "./user";

export interface MeetingRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: number;
  members: RoomMember[];
}

export type CreateRoomInput = Pick<MeetingRoom, "name" | "description">;
