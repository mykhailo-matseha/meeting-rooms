"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";
import { registerSchema } from "@/lib/schemas";

export default function RegisterForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!validation.success) {
      const firstErrorMessage = validation.error.issues[0]?.message;
      setError(firstErrorMessage);
      return;
    }
    try {
      setIsLoading(true);
      await signup(
        validation.data.name,
        validation.data.email,
        validation.data.password,
      );
      router.push("/");
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl p-3 text-center">
          {error}
        </div>
      )}
      <Field label="Full Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alex@company.com"
          required
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="CM2/£*D5lja3"
          required
        />
      </Field>
      <Field label="Confirm Password">
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="CM2/£*D5lja3"
          required
        />
      </Field>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-white py-3 mt-2"
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
