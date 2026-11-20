"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { roomSchema } from "@/lib/schemas";
import Alert from "../ui/Alert";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  initialData?: { name: string; description: string } | null;
}

export default function RoomModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RoomModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const validation = roomSchema.safeParse({ name, description });
      if (!validation.success) {
        setError(validation.error.issues[0]?.message);
        return;
      }
      await onSubmit(validation.data.name, validation.data.description);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Meeting Room" : "Create Meeting Room"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <Alert>{error}</Alert>}

        <Field label="Room Name">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Conference Hall"
            required
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Equipped with 4K projector, whiteboard, 10 seats."
            rows={3}
            className="w-full bg-surface border border-border rounded-xl py-2 px-3.5 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
          />
        </Field>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            size="md"
            className="bg-surface hover:bg-surface-hover border border-border text-muted hover:text-foreground"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !name.trim()} size="md">
            {isLoading
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Create Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
