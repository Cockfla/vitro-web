/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vitro: "#fab043",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"],
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.2)" },
          "50%": { transform: "scaleY(1)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(40px, 30px, 0)" },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        "drift-slow": "drift 22s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [],
};
