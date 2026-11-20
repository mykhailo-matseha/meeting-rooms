import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to manage and book meeting rooms"
      footer={
        <p className="text-sm text-center text-muted">
          Dont have an account yet?{" "}
          <Link
            href="/register"
            className="text-accent hover:underline font-medium"
          >
            Make one!
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
