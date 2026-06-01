import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
      <Link
        to="/login"
        className="rounded-xl border border-border px-6 py-3"
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="rounded-xl border border-border px-6 py-3"
      >
        Sign Up
      </Link>

      <h1 className="mt-8 text-5xl font-bold">
        Watch Up
      </h1>
    </div>
  );
}