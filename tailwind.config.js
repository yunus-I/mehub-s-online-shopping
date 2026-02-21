/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4747', // A beautiful brand red/pink for Mehub
        secondary: '#1E1E1E', // Dark sleek color for text
        background: '#F8FAFC', // Very light gray/blue for the app background
      }
    },
  },
  plugins: [],
}