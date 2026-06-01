import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WelcomeAnimation from "../components/WelcomeAnimation";
import useAuthStore from "../store/authStore";

export default function WelcomePage() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAnimationComplete = () => {
    navigate("/dashboard");
  };

  return (
    <WelcomeAnimation
      nickname={
        user?.displayName ||
        user?.email?.split("@")[0] ||
        "Investor"
      }
      onComplete={handleAnimationComplete}
    />
  );
}