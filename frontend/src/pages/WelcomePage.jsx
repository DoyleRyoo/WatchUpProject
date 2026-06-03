import { motion } from "framer-motion";

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">

      <motion.h1
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: 0,
        }}
        transition={{
          duration: 2,
        }}
        className="text-6xl font-bold"
      >
        Watch Up!
      </motion.h1>

    </div>
  );
}
