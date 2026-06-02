/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        border: "#334155",

        profit: "#EF4444",
        loss: "#3B82F6",
      },
    },
  },
  plugins: [],
};