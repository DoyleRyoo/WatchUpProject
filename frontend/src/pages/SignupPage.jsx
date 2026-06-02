import { useState } from "react";

import { signup } from "../services/authService";

import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const handleSignup = async () => {
    try {
      await signup(
        email,
        password,
        nickname
      );

      navigate("/login");
    } catch (err) {
      alert(err.message);
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="h-12 w-full rounded-xl bg-slate-800 px-4"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <input
            className="h-12 w-full rounded-xl bg-slate-800 px-4"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) =>
              setNickname(
                e.target.value
              )
            }
          />

          <button
            onClick={handleSignup}
            className="h-12 w-full rounded-xl bg-blue-600"
          >
            Sign Up
          </button>

        </div>

      </div>

    </div>
  );
}