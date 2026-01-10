/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EF4444",
          light: "#F87171",
          dark: "#B91C1C",
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