import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="
      sticky
      top-0
      z-50
      backdrop-blur-xl
      bg-slate-950/70
      border-b
      border-slate-800
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        h-16
        flex
        items-center
        justify-between
        "
      >
        <h1
          className="
          text-2xl
          font-black
          text-white
          tracking-tight
          "
        >
          Watch Up
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-slate-300">
            {user?.displayName || "Investor"}
          </span>

          <button
            onClick={handleLogout}
            className="
            px-4
            py-2
            rounded-xl
            bg-red-500
            hover:bg-red-600
            transition
            text-white
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}