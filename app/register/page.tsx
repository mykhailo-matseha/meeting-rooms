import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      description="Sign up to start booking meeting rooms"
      footer={
        <p className="text-sm text-center text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
