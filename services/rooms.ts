import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { MeetingRoom } from "@/types/room";
import { db } from "@/lib/firebase";
import { RoomMember, RoomRole } from "@/types";

const COLLECTION_NAME = "rooms";

export function subscribeRooms(callback: (rooms: MeetingRoom[]) => void) {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const rooms: MeetingRoom[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<MeetingRoom, "id">),
    }));
    callback(rooms);
  });
}

export async function createRoom(
  name: string,
  description: string,
  creatorEmail: string,
) {
  return await addDoc(collection(db, COLLECTION_NAME), {
    name: name.trim(),
    description: description.trim(),
    createdBy: creatorEmail.toLowerCase(),
    createdAt: Date.now(),
    members: [
      {
        email: creatorEmail.toLowerCase(),
        role: "admin",
      },
    ],
  });
}

export async function updateRoom(
  roomId: string,
  name: string,
  description: string,
) {
  const roomRef = doc(db, COLLECTION_NAME, roomId);
  return await updateDoc(roomRef, {
    name: name.trim(),
    description: description.trim(),
  });
}

export async function deleteRoom(roomId: string) {
  const roomRef = doc(db, COLLECTION_NAME, roomId);
  return await deleteDoc(roomRef);
}

export function subscribeRoom(
  roomId: string,
  callback: (room: MeetingRoom | null) => void,
) {
  const roomRef = doc(db, COLLECTION_NAME, roomId);
  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({
        id: docSnap.id,
        ...(docSnap.data() as Omit<MeetingRoom, "id">),
      });
    } else {
      callback(null);
    }
  });
}

export async function addRoomMember(
  roomId: string,
  memberEmail: string,
  role: RoomRole,
) {
  const roomRef = doc(db, COLLECTION_NAME, roomId);
  const email = memberEmail.trim().toLowerCase();
  await runTransaction(db, async (transaction) => {
    const roomData = await transaction.get(roomRef);
    if (!roomData.exists()) {
      throw new Error("Room not found");
    }
    const members: RoomMember[] = roomData.data().members || [];
    const isMemberExist = members.some((m) => m.email === email);
    let updatedMembers: RoomMember[];
    if (isMemberExist) {
      updatedMembers = members.map((m) =>
        m.email === email ? { ...m, role } : m,
      );
    } else {
      updatedMembers = [...members, { email, role }];
    }
    transaction.update(roomRef, { members: updatedMembers });
  });
}

export async function removeRoomMember(roomId: string, memberEmail: string) {
  const roomRef = doc(db, COLLECTION_NAME, roomId);
  const email = memberEmail.trim().toLowerCase();
  await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }
    const members: RoomMember[] = roomSnap.data().members || [];
    const updatedMembers = members.filter((m) => m.email !== email);
    transaction.update(roomRef, { members: updatedMembers });
  });
}
