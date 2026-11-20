import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking, CreateBookingInput } from "@/types/booking";

const COLLECTION_NAME = "bookings";

export function subscribeRoomBookings(
  roomId: string,
  callback: (bookings: Booking[]) => void,
) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("roomId", "==", roomId),
    orderBy("date", "asc"),
    orderBy("startTime", "asc"),
  );

  return onSnapshot(q, (snapshot) => {
    const bookings: Booking[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Booking, "id">),
    }));
    callback(bookings);
  });
}

export async function checkBookingConflict(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string,
): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("roomId", "==", roomId),
    where("date", "==", date),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.some((doc) => {
    if (doc.id === excludeBookingId) return false;
    const data = doc.data();
    return startTime < data.endTime && endTime > data.startTime;
  });
}

export async function createBooking(
  input: CreateBookingInput,
  userEmail: string,
  userName: string,
) {
  if (input.endTime <= input.startTime) {
    throw new Error("End time must be after start time");
  }
  const hasConflict = await checkBookingConflict(
    input.roomId,
    input.date,
    input.startTime,
    input.endTime,
  );

  if (hasConflict) {
    throw new Error(
      "This time slot is already booked. Please choose a different time.",
    );
  }

  return await addDoc(collection(db, COLLECTION_NAME), {
    roomId: input.roomId,
    title: input.title.trim(),
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    createdBy: userEmail.toLowerCase(),
    createdByName: userName || userEmail,
    participants: [userEmail.toLowerCase()],
    createdAt: Date.now(),
  });
}

export async function deleteBooking(bookingId: string) {
  const bookingRef = doc(db, COLLECTION_NAME, bookingId);
  return await deleteDoc(bookingRef);
}

export async function toggleJoinBooking(
  bookingId: string,
  currentParticipants: string[],
  userEmail: string,
) {
  const email = userEmail.trim().toLowerCase();
  const bookingRef = doc(db, COLLECTION_NAME, bookingId);

  const isJoined = currentParticipants.includes(email);
  const updatedParticipants = isJoined
    ? currentParticipants.filter((e) => e !== email)
    : [...currentParticipants, email];

  return await updateDoc(bookingRef, {
    participants: updatedParticipants,
  });
}
