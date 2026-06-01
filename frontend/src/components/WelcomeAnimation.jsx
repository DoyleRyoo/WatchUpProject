import { motion } from "framer-motion";
import { useEffect } from "react";

export default function WelcomeAnimation({ nickname, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-[#0B0F19]">

      {/* Watch Up */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
        className="absolute text-6xl font-black text-white"
      >
        Watch Up!
      </motion.div>

      {/* Welcome + nickname */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], y: 0 }}
        transition={{
          duration: 3.5,
          times: [0, 0.2, 0.7, 1],
          ease: "easeInOut",
        }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-white">
          Welcome
        </h1>
        <h2 className="text-4xl font-semibold text-slate-300">
          {nickname}
        </h2>
      </motion.div>

    </div>
  );
}