import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Header({
  nickname,
}) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header
      className="
      sticky top-0 z-50
      backdrop-blur-xl
      bg-white/5
      border-b border-white/10
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-4
        flex
        justify-between
        items-center
        "
      >
        <h1
          className="
          text-2xl
          font-bold
          text-white
          "
        >
          Watch Up
        </h1>

        <div className="flex gap-3">
          <button
            className="
            h-11
            px-5
            rounded-xl
            bg-white/10
            text-white
            "
          >
            {nickname}
          </button>

          <button
            onClick={handleLogout}
            className="
            h-11
            px-5
            rounded-xl
            bg-red-500
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