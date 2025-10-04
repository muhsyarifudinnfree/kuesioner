/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Menambahkan 'Inter' sebagai font utama jika Anda mau
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
