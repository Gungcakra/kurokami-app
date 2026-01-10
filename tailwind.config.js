/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FEE2E2",
          200: "#FCA5A5",
          300: "#F87171",
          400: "#EF4444",
          500: "#DC2626",
          600: "#B91C1C",
          700: "#991B1B",
          800: "#7F1D1D",
          900: "#611A1A",
        },
        zinc: {
          bg: "#1A1A1F",
          secondary: "#121215",
          elevated: "#1F1F25",
          soft: "#2A2A32",
          text: "#F4F4F5",
          muted: "#A1A1AA",
          border: "#2C2C34"
        }
      },
    },
  },
  plugins: [],
};