/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        card: "#111827",
        border: "#1F2937",

        profit: "#EF4444",
        loss: "#3B82F6",

        primary: "#F8FAFC",
        secondary: "#94A3B8",
      },

      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },

      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};