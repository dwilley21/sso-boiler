/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'mint': '#D1E8E2',
        'teal': '#19747E',
        'sky': '#A9D6E5',
        'lightgray': '#E2E2E2',
        'teal-dark': '#156570',
        'sky-dark': '#8ec7d9',
      }
    },
  },
  plugins: [],
}

