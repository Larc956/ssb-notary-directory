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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom SSB Branding Colors
        brand: {
          blue: "#003A6C", // Deep Scholars blue
          light: "#E6F0F9", // Soft blue for backgrounds
          accent: "#FBB040", // Yellow/Gold for highlights or pending pins
        }
      },
    },
  },
  plugins: [],
};