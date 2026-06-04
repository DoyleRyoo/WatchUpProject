import { useState } from "react";

import { login } from "../services/authService";

import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      await login(
        email,
        password
      );

      navigate("/welcome");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">

      <div className="w-96 rounded-3xl bg-card p-8">

        <h1 className="mb-8 text-center text-3xl font-bold">
          Watch Up!
        </h1>

        <div className="space-y-4">

          <input
            className="h-12 w-full rounded-xl bg-slate-800 px-4"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <input
            className="h-12 w-full rounded-xl bg-slate-800 px-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="h-12 w-full rounded-xl bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}