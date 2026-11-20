export interface Booking {
  id: string;
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  createdByName: string;
  participants: string[];
  createdAt: number;
}

export interface CreateBookingInput {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}
