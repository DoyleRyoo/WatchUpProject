import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-80 rounded-3xl border border-border bg-card p-8 text-center">

        <div className="mb-8 text-3xl font-bold">
          Watch Up!
        </div>

        <div className="space-y-4">

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-700"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </div>
  );
}