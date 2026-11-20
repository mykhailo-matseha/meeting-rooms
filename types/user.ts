export type RoomRole = "admin" | "user";

export interface RoomMember {
  email: string;
  role: RoomRole;
  addedAt?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
}
