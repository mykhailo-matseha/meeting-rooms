"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { RoomRole } from "@/types/user";
import { addRoomMember } from "@/services/rooms";
import Heading from "@/components/ui/Heading";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Radio from "@/components/ui/Radio";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { addMemberSchema } from "@/lib/schemas";

interface AddMemberFormProps {
  roomId: string;
}

export default function AddMemberForm({ roomId }: AddMemberFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoomRole>("user");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    const validation = addMemberSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message);
      return;
    }

    try {
      setIsLoading(true);
      await addRoomMember(roomId, validation.data.email, role);
      setEmail("");
      setRole("user");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add member");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-accent" />
        <Heading as="h2" size="sm" className="text-foreground">
          Invite Member
        </Heading>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert>{error}</Alert>}

        <Field label="User Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            required
          />
        </Field>

        <Field label="Role">
          <div className="flex items-center gap-6 pt-1">
            <Radio
              name="role"
              label="User"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            <Radio
              name="role"
              label="Admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
          </div>
        </Field>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 mt-2"
        >
          {isLoading ? "Adding..." : "Add to Room"}
        </Button>
      </form>
    </div>
  );
}
