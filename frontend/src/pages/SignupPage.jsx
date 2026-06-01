import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function SignupPage() {
  const navigate = useNavigate();

  const signup = useAuthStore(
    (state) => state.signup
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(
        form.email,
        form.password,
        form.nickname
      );

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
      >
        <h1 className="text-3xl text-white font-bold mb-8 text-center">
          Watch Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-slate-900 text-white"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl bg-slate-900 text-white"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Nickname"
          className="w-full mb-6 p-3 rounded-xl bg-slate-900 text-white"
          value={form.nickname}
          onChange={(e) =>
            setForm({
              ...form,
              nickname: e.target.value,
            })
          }
        />

        <button
          className="w-full h-12 rounded-xl bg-blue-600 text-white"
        >
          Sign Up
        </button>

        <Link
          to="/login"
          className="block text-center text-slate-400 mt-4"
        >
          Already have an account?
        </Link>
      </form>
    </div>
  );
}