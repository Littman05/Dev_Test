/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        ink: "#111827",
        muted: "#6b7280",
        surface: "#ffffff",
      },
      boxShadow: {
        soft: "0 20px 60px -35px rgba(15, 23, 42, 0.45)",
        card: "0 18px 45px -30px rgba(15, 23, 42, 0.55)",
      },
      screens: {
        'vsm': '380px'
      }
    },
  },
  plugins: [require('tailwindcss-effector')],
}

