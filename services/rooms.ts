import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { MeetingRoom } from "@/types/room";
import { db } from "@/lib/firebase";

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
